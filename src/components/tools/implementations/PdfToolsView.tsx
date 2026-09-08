import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../../../types';
import { 
  Upload, FileText, Download, Check, AlertCircle, 
  Trash2, ArrowUp, ArrowDown, RotateCw, Sparkles, RefreshCw, Archive, Sliders,
  Layers, Settings2, Gauge, FileCheck2, Info, Eye
} from 'lucide-react';
import { usageLimitService } from '../../../services/usageLimitService';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  loadPdfDocument, 
  mergePdfFiles, 
  splitPdfByRange, 
  extractAllPdfPages,
  rotatePdfPages, 
  compileImagesToPdf, 
  optimizePdf, 
  inspectPdf,
  compressPdfDocument,
  analyzePdfDocument,
  PdfMetadata,
  PdfAnalysisResult,
  PdfCompressionResult,
  PdfCompressionPreset,
  PdfCompressionIntensity
} from '../../../services/toolEngine/pdfEngine';
import { 
  validateUploadedFile, 
  createManagedUrl, 
  revokeManagedUrl, 
  formatFileSize 
} from '../../../services/toolEngine/fileEngine';
import { downloadZipArchive, downloadBlob } from '../../../services/toolEngine/downloadEngine';

interface PdfToolsViewProps {
  tool: ToolDefinition;
}

interface UploadedFileItem {
  file: File;
  name: string;
  size: number;
}

export const PdfToolsView: React.FC<PdfToolsViewProps> = ({ tool }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  
  // State
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState('processed.pdf');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tool-specific parameters
  const [splitMode, setSplitMode] = useState<'range' | 'zip_all'>('range');
  const [splitRange, setSplitRange] = useState('1-3');
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [compressionLevel, setCompressionLevel] = useState<'basic' | 'balanced' | 'strong'>('balanced');
  const [imagePageSize, setImagePageSize] = useState<'fit' | 'a4' | 'letter'>('fit');
  const [metadataInfo, setMetadataInfo] = useState<PdfMetadata | null>(null);

  // Advanced PDF Compression states
  const [compressionPreset, setCompressionPreset] = useState<PdfCompressionPreset>('document');
  const [compressionIntensity, setCompressionIntensity] = useState<PdfCompressionIntensity>('balanced');
  const [customDpi, setCustomDpi] = useState<number>(150);
  const [customQuality, setCustomQuality] = useState<number>(70);
  const [applyGrayscale, setApplyGrayscale] = useState<boolean>(false);
  const [scannedOptimization, setScannedOptimization] = useState<boolean>(false);
  const [stripMetadata, setStripMetadata] = useState<boolean>(true);
  const [showAdvancedCompression, setShowAdvancedCompression] = useState<boolean>(false);
  const [pdfAnalysis, setPdfAnalysis] = useState<PdfAnalysisResult | null>(null);
  const [compressionResult, setCompressionResult] = useState<PdfCompressionResult | null>(null);
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState<boolean>(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      revokeManagedUrl(downloadUrl);
    };
  }, [downloadUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const incomingFiles = Array.from(e.target.files) as File[];

    setErrorMessage(null);
    setStatusMessage(null);
    revokeManagedUrl(downloadUrl);
    setDownloadUrl(null);

    // Validate files
    const validItems: UploadedFileItem[] = [];
    const allowed = tool.slug === 'images-to-pdf' ? ['image' as const] : ['pdf' as const];

    for (const f of incomingFiles) {
      const val = await validateUploadedFile(f, { allowedTypes: allowed });
      if (!val.valid) {
        setErrorMessage(val.error || `File ${f.name} could not be validated.`);
        return;
      }
      validItems.push({
        file: f,
        name: f.name,
        size: f.size
      });
    }

    if (tool.slug === 'pdf-merge' || tool.slug === 'images-to-pdf') {
      setFiles(prev => [...prev, ...validItems]);
    } else {
      setFiles(validItems.slice(0, 1));
    }

    // If metadata inspection tool, inspect immediately
    if (tool.slug === 'pdf-metadata' || tool.slug === 'pdf-page-counter') {
      try {
        const meta = await inspectPdf(validItems[0].file);
        setMetadataInfo(meta);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(msg);
      }
    }

    // If PDF compression tool, analyze document composition
    if (tool.slug === 'pdf-compress' && validItems.length > 0) {
      setIsAnalyzingPdf(true);
      setPdfAnalysis(null);
      setCompressionResult(null);
      analyzePdfDocument(validItems[0].file)
        .then(analysis => {
          setPdfAnalysis(analysis);
          setCompressionIntensity(analysis.recommendedMode);
          setCompressionPreset(analysis.recommendedPreset);
          if (analysis.classification === 'scanned') {
            setScannedOptimization(true);
          }
        })
        .catch(err => console.warn('PDF analysis fallback:', err))
        .finally(() => setIsAnalyzingPdf(false));
    }
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    revokeManagedUrl(downloadUrl);
    setDownloadUrl(null);
    setErrorMessage(null);
  };

  const moveFile = (idx: number, dir: -1 | 1) => {
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === files.length - 1)) return;
    const updated = [...files];
    const item = updated.splice(idx, 1)[0];
    updated.splice(idx + dir, 0, item);
    setFiles(updated);
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      setErrorMessage(isHindi ? 'कृपया कम से कम एक फाइल चुनें।' : 'Please select at least one file.');
      return;
    }

    const usageCheck = usageLimitService.checkUsage(tool.id);
    if (!usageCheck.hasAccess) {
      setErrorMessage(usageCheck.message || 'Daily limit reached.');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(10);
    setErrorMessage(null);
    setStatusMessage(null);
    revokeManagedUrl(downloadUrl);
    setDownloadUrl(null);

    try {
      if (tool.slug === 'pdf-merge') {
        if (files.length < 2) {
          throw new Error(isHindi ? 'कम से कम 2 पीडीएफ जोड़ें।' : 'Please select at least 2 PDF documents to merge.');
        }

        const pdfBytes = await mergePdfFiles(
          files.map(f => f.file),
          (progress) => setProgressPercent(progress)
        );

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = createManagedUrl(blob);
        setDownloadUrl(url);
        setDownloadFileName('merged_document.pdf');
        setStatusMessage(isHindi ? 'सभी पीडीएफ सफलतापूर्वक मर्ज हो गए!' : `Successfully merged ${files.length} PDFs into a single document!`);

      } else if (tool.slug === 'pdf-split') {
        if (splitMode === 'zip_all') {
          // Extract each page and archive into a ZIP
          const pageResults = await extractAllPdfPages(
            files[0].file,
            (progress) => setProgressPercent(progress)
          );

          const zipEntries = pageResults.map(p => ({
            name: p.filename,
            content: p.pdfBytes
          }));

          await downloadZipArchive(zipEntries, `${files[0].name.replace(/\.[^/.]+$/, '')}_all_pages.zip`);
          setStatusMessage(`Extracted all ${pageResults.length} pages directly as a ZIP archive!`);
          setProgressPercent(100);

        } else {
          // Range split into single PDF
          const { pdfBytes, extractedPageCount } = await splitPdfByRange(
            files[0].file,
            splitRange,
            (progress) => setProgressPercent(progress)
          );

          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = createManagedUrl(blob);
          setDownloadUrl(url);
          setDownloadFileName(`extracted_${files[0].name}`);
          setStatusMessage(`Extracted ${extractedPageCount} page(s) successfully!`);
        }

      } else if (tool.slug === 'pdf-rotate') {
        setProgressPercent(30);
        const pdfBytes = await rotatePdfPages(files[0].file, rotationAngle);
        setProgressPercent(90);

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = createManagedUrl(blob);
        setDownloadUrl(url);
        setDownloadFileName(`rotated_${rotationAngle}deg_${files[0].name}`);
        setStatusMessage(`Successfully rotated document pages by ${rotationAngle}°!`);
        setProgressPercent(100);

      } else if (tool.slug === 'images-to-pdf') {
        const pdfBytes = await compileImagesToPdf(
          files.map(f => f.file),
          imagePageSize,
          20,
          (progress) => setProgressPercent(progress)
        );

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = createManagedUrl(blob);
        setDownloadUrl(url);
        setDownloadFileName('compiled_photos.pdf');
        setStatusMessage(`Converted ${files.length} photo(s) to a standard PDF document!`);

      } else if (tool.slug === 'pdf-compress') {
        const result = await compressPdfDocument(
          files[0].file,
          {
            intensity: compressionIntensity,
            preset: compressionPreset,
            dpi: showAdvancedCompression ? customDpi : undefined,
            imageQuality: showAdvancedCompression ? customQuality / 100 : undefined,
            grayscale: applyGrayscale,
            scannedMode: scannedOptimization,
            removeMetadata: stripMetadata
          },
          (progress, msg) => {
            setProgressPercent(progress);
            setStatusMessage(msg);
          }
        );

        setCompressionResult(result);
        const blob = new Blob([result.pdfBytes], { type: 'application/pdf' });
        const url = createManagedUrl(blob);
        setDownloadUrl(url);
        setDownloadFileName(result.isSmaller ? `compressed_${files[0].name}` : `original_${files[0].name}`);

        if (result.isSmaller) {
          setStatusMessage(
            `Saved ${result.savingsPercentage}%! (${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} in ${(result.processingTimeMs / 1000).toFixed(1)}s)`
          );
        } else {
          setStatusMessage(
            `File already compact: ${formatFileSize(result.compressedSize)}. No further compression possible.`
          );
        }
      }

      usageLimitService.recordUsage(tool.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const isMultiple = tool.slug === 'pdf-merge' || tool.slug === 'images-to-pdf';
  const acceptedTypes = tool.slug === 'images-to-pdf' ? 'image/png,image/jpeg,image/webp' : 'application/pdf';

  return (
    <div className="space-y-6">
      {/* File Dropzone */}
      <div className="relative border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 sm:p-8 text-center transition-colors bg-slate-50/50 dark:bg-white/[0.02]">
        <input
          type="file"
          accept={acceptedTypes}
          multiple={isMultiple}
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isHindi ? 'फाइलें यहां ड्रैग करें या क्लिक करके चुनें' : 'Drag & drop files here, or click to browse'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {tool.slug === 'images-to-pdf' ? 'Supports JPG, PNG, and WebP (up to 50MB)' : 'Supports standard PDF documents (100% private in-browser)'}
          </p>
        </div>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{files.length} {isHindi ? 'फाइलें चुनी गईं' : 'file(s) selected'}</span>
            <button
              onClick={() => { setFiles([]); revokeManagedUrl(downloadUrl); setDownloadUrl(null); }}
              className="text-red-500 hover:text-red-600 cursor-pointer font-bold"
            >
              {isHindi ? 'सभी हटाएं' : 'Clear All'}
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {files.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">({formatFileSize(item.size)})</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {(tool.slug === 'pdf-merge' || tool.slug === 'images-to-pdf') && (
                    <>
                      <button
                        onClick={() => moveFile(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveFile(idx, 1)}
                        disabled={idx === files.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 text-red-500 hover:text-red-700 rounded cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool-specific configuration controls */}
      {tool.slug === 'pdf-split' && files.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setSplitMode('range')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                splitMode === 'range'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isHindi ? 'पेज रेंज निकालें (सिंगल PDF)' : 'Extract Specific Range'}
            </button>
            <button
              onClick={() => setSplitMode('zip_all')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                splitMode === 'zip_all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{isHindi ? 'हर पेज अलग करें (ZIP)' : 'Split All Pages (ZIP)'}</span>
            </button>
          </div>

          {splitMode === 'range' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isHindi ? 'पेज नंबर या रेंज दर्ज करें (उदा: 1-3, 5):' : 'Enter Page Range to Extract (e.g. 1-3, 5, 8-10):'}
              </label>
              <input
                type="text"
                value={splitRange}
                onChange={(e) => setSplitRange(e.target.value)}
                placeholder="1-3, 5"
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-blue-500"
              />
            </div>
          )}
        </div>
      )}

      {tool.slug === 'pdf-rotate' && files.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {isHindi ? 'घुमाने का कोण चुनें:' : 'Select Rotation Angle:'}
          </label>
          <div className="flex gap-3">
            {[90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => setRotationAngle(deg as any)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  rotationAngle === deg
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {deg}° Clockwise
              </button>
            ))}
          </div>
        </div>
      )}

      {tool.slug === 'pdf-compress' && files.length > 0 && (
        <div className="space-y-4">
          {/* Document Analysis Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  {isHindi ? 'दस्तावेज़ विश्लेषण' : 'Document Composition Analysis'}
                </span>
              </div>
              {isAnalyzingPdf ? (
                <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 animate-pulse flex items-center gap-1.5 shrink-0">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{isHindi ? 'विश्लेषण जारी...' : 'Analyzing PDF streams...'}</span>
                </span>
              ) : pdfAnalysis ? (
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                  pdfAnalysis.classification === 'scanned'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    : pdfAnalysis.classification === 'image_heavy'
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
                    : pdfAnalysis.classification === 'text_vector'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                }`}>
                  {pdfAnalysis.classification.replace('_', ' ')}
                </span>
              ) : null}
            </div>

            {pdfAnalysis && (
              <div className="space-y-2 text-xs">
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  {pdfAnalysis.note}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Pages</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{pdfAnalysis.pageCount}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Images</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{pdfAnalysis.estimatedImageCount}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Image Load</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{formatFileSize(pdfAnalysis.estimatedImageBytes)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Strategy</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 capitalize">{pdfAnalysis.recommendedMode}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preset Selector */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-600" />
                <span>{isHindi ? 'कम्प्रेशन प्रीसेट:' : 'Compression Preset:'}</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">Standard & Court Document Profiles</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'document', label: 'Document', desc: '150 DPI · Court & Official' },
                { id: 'web', label: 'Web Upload', desc: '120 DPI · Portal Friendly' },
                { id: 'email', label: 'Email', desc: '96 DPI · Compact Size' },
                { id: 'high_compression', label: 'Maximum Cut', desc: '96 DPI · 35% Quality' },
                { id: 'print', label: 'Print Fidelity', desc: '220 DPI · Crisp Text' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCompressionPreset(p.id as PdfCompressionPreset);
                    if (p.id === 'document') { setCompressionIntensity('balanced'); setCustomDpi(150); setCustomQuality(70); }
                    if (p.id === 'web') { setCompressionIntensity('high'); setCustomDpi(120); setCustomQuality(55); }
                    if (p.id === 'email') { setCompressionIntensity('high'); setCustomDpi(96); setCustomQuality(45); }
                    if (p.id === 'high_compression') { setCompressionIntensity('extreme'); setCustomDpi(96); setCustomQuality(35); }
                    if (p.id === 'print') { setCompressionIntensity('low'); setCustomDpi(220); setCustomQuality(85); }
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    compressionPreset === p.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold mb-0.5 whitespace-nowrap">{p.label}</div>
                  <div className={`text-[10px] leading-tight ${compressionPreset === p.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Intensity Buttons */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {isHindi ? 'तीव्रता (Intensity):' : 'Compression Intensity:'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'low', label: 'Low', desc: 'Highest Quality' },
                  { id: 'balanced', label: 'Balanced', desc: 'Recommended' },
                  { id: 'high', label: 'High', desc: 'Small File' },
                  { id: 'extreme', label: 'Extreme', desc: 'Aggressive' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setCompressionIntensity(lvl.id as PdfCompressionIntensity)}
                    className={`py-2 px-2 rounded-lg text-center border transition-all cursor-pointer ${
                      compressionIntensity === lvl.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="block text-xs font-bold whitespace-nowrap">{lvl.label}</span>
                    <span className={`block text-[10px] ${compressionIntensity === lvl.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {lvl.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Advanced Controls */}
            <div className="pt-2">
              <button
                onClick={() => setShowAdvancedCompression(!showAdvancedCompression)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 cursor-pointer hover:underline"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{showAdvancedCompression ? 'Hide Custom Resolution & DPI Controls' : 'Show Advanced DPI, Grayscale & Scanned Document Controls'}</span>
              </button>
            </div>

            {/* Advanced Settings Drawer */}
            {showAdvancedCompression && (
              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 space-y-3 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* DPI Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Target Raster DPI: <span className="text-blue-600 font-mono">{customDpi} DPI</span>
                    </label>
                    <div className="flex gap-1.5">
                      {[96, 120, 150, 200, 300].map(d => (
                        <button
                          key={d}
                          onClick={() => setCustomDpi(d)}
                          className={`flex-1 py-1.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                            customDpi === d
                              ? 'bg-slate-900 text-white dark:bg-blue-600 border-transparent'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Image Re-encode Quality:
                      </label>
                      <span className="text-xs font-mono font-bold text-blue-600">{customQuality}%</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={95}
                      step={5}
                      value={customQuality}
                      onChange={(e) => setCustomQuality(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                {/* Additional Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyGrayscale}
                      onChange={(e) => setApplyGrayscale(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Grayscale Mode (B&W)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scannedOptimization}
                      onChange={(e) => setScannedOptimization(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Scanned Document Pipeline
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stripMetadata}
                      onChange={(e) => setStripMetadata(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Strip Unused Metadata
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Honest Before / After Report */}
          {compressionResult && (
            <div className={`p-4 rounded-xl border ${
              compressionResult.isSmaller
                ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {compressionResult.isSmaller ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                    {compressionResult.isSmaller ? 'Genuine Compression Verified' : 'Document Already Maximally Optimized'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {(compressionResult.processingTimeMs / 1000).toFixed(1)}s
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Original Size</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">
                    {formatFileSize(compressionResult.originalSize)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Compressed Size</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatFileSize(compressionResult.compressedSize)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Space Saved</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    {formatFileSize(compressionResult.savingsBytes)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Reduction</span>
                  <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                    {compressionResult.savingsPercentage}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {compressionResult.message}
              </p>

              {!compressionResult.isSmaller && !scannedOptimization && (
                <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between">
                  <span className="text-xs text-amber-800 dark:text-amber-300">
                    Need further size reduction for scanned court paper?
                  </span>
                  <button
                    onClick={() => {
                      setScannedOptimization(true);
                      handleProcess();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 cursor-pointer"
                  >
                    Try Scanned Document Pipeline
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tool.slug === 'images-to-pdf' && files.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {isHindi ? 'पेज साइज मोड:' : 'Page Sizing:'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'fit', label: 'Fit to Photo' },
              { id: 'a4', label: 'Standard A4' },
              { id: 'letter', label: 'US Letter' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setImagePageSize(opt.id as any)}
                className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  imagePageSize === opt.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Metadata / Page Counter Results */}
      {(tool.slug === 'pdf-metadata' || tool.slug === 'pdf-page-counter') && metadataInfo && (
        <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{isHindi ? 'कुल पेज:' : 'Total Page Count:'}</span>
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{metadataInfo.pageCount} Pages</span>
          </div>
          {metadataInfo.title && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Title:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px]">{metadataInfo.title}</span>
            </div>
          )}
          {metadataInfo.author && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Author:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{metadataInfo.author}</span>
            </div>
          )}
          {metadataInfo.producer && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Producer:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{metadataInfo.producer}</span>
            </div>
          )}
          {metadataInfo.creationDate && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Created:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{metadataInfo.creationDate}</span>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {isProcessing && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{isHindi ? 'प्रोसेसिंग प्रगति' : 'Processing document...'}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-200 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message with Recovery Options */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => { setErrorMessage(null); setFiles([]); }}
            className="text-[11px] font-bold underline cursor-pointer hover:text-red-800 shrink-0 self-start sm:self-auto"
          >
            {isHindi ? 'दूसरी फाइल चुनें' : 'Choose Another File'}
          </button>
        </div>
      )}

      {/* Success Message */}
      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {tool.slug !== 'pdf-metadata' && tool.slug !== 'pdf-page-counter' && (
          <button
            onClick={handleProcess}
            disabled={isProcessing || files.length === 0}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isHindi ? 'प्रोसेसिंग...' : 'Processing in browser...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isHindi ? 'प्रोसेस करें' : 'Process Document'}</span>
              </>
            )}
          </button>
        )}

        {downloadUrl && (
          <a
            href={downloadUrl}
            download={downloadFileName}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer animate-in fade-in"
          >
            <Download className="w-4 h-4" />
            <span>{isHindi ? 'डाउनलोड करें' : 'Download Output'}</span>
          </a>
        )}
      </div>
    </div>
  );
};
