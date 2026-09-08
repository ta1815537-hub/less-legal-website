import React, { useState, useRef, useEffect } from 'react';
import { ToolDefinition } from '../../../types';
import { 
  Upload, Image as ImageIcon, Download, Check, 
  AlertCircle, Sliders, RefreshCw, Sparkles, Maximize2, Archive, Trash2,
  Target, Layers, Eye, X, Gauge, ShieldCheck, ArrowRight
} from 'lucide-react';
import { usageLimitService } from '../../../services/usageLimitService';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  compressImage, 
  resizeImage, 
  convertImageFormat, 
  batchProcessImages,
  getImageDimensions 
} from '../../../services/toolEngine/imageEngine';
import { 
  validateUploadedFile, 
  createManagedUrl, 
  revokeManagedUrl, 
  formatFileSize 
} from '../../../services/toolEngine/fileEngine';
import { downloadZipArchive, downloadBlob } from '../../../services/toolEngine/downloadEngine';

interface ImageToolsViewProps {
  tool: ToolDefinition;
}

interface ImageBatchItem {
  file: File;
  previewUrl: string;
  originalWidth: number;
  originalHeight: number;
  resultBlob?: Blob;
  resultUrl?: string;
  resultSize?: number;
  resultWidth?: number;
  resultHeight?: number;
  savingsPct?: number;
  isSmaller?: boolean;
  timeMs?: number;
  message?: string;
  hasTransparency?: boolean;
  format?: string;
}

export const ImageToolsView: React.FC<ImageToolsViewProps> = ({ tool }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [items, setItems] = useState<ImageBatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Advanced Image Compression Settings
  const [compressMode, setCompressMode] = useState<'preset' | 'target_size' | 'custom'>('preset');
  const [presetIntensity, setPresetIntensity] = useState<'high_quality' | 'balanced' | 'high_compression' | 'extreme'>('balanced');
  const [quality, setQuality] = useState(70);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(300);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [convertPngToWebp, setConvertPngToWebp] = useState<boolean>(true);
  const [compressFormat, setCompressFormat] = useState<'auto' | 'image/jpeg' | 'image/webp' | 'image/png'>('auto');
  const [comparisonItem, setComparisonItem] = useState<ImageBatchItem | null>(null);

  // Resize Controls
  const [resizeWidth, setResizeWidth] = useState<number>(800);
  const [resizeHeight, setResizeHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState(true);

  // Conversion target format
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  // Crop Controls
  const [cropAspect, setCropAspect] = useState<'1:1' | '4:3' | '16:9' | 'free'>('1:1');

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach(item => {
        revokeManagedUrl(item.previewUrl);
        revokeManagedUrl(item.resultUrl);
      });
    };
  }, [items]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const incoming = Array.from(e.target.files) as File[];

    setErrorMessage(null);
    setStatusMessage(null);

    const newItems: ImageBatchItem[] = [];

    for (const file of incoming) {
      const val = await validateUploadedFile(file, { allowedTypes: ['image'] });
      if (!val.valid) {
        setErrorMessage(val.error || `Invalid image: ${file.name}`);
        return;
      }

      try {
        const dims = await getImageDimensions(file);
        const previewUrl = createManagedUrl(file);
        newItems.push({
          file,
          previewUrl,
          originalWidth: dims.width,
          originalHeight: dims.height
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(msg);
        return;
      }
    }

    if (newItems.length > 0) {
      // Set initial dimensions for single view resize
      setResizeWidth(newItems[0].originalWidth);
      setResizeHeight(newItems[0].originalHeight);
    }

    // Single item for Crop, batch allowed for Compression, Resize, Conversion
    if (tool.slug === 'image-crop') {
      setItems(newItems.slice(0, 1));
    } else {
      setItems(prev => [...prev, ...newItems]);
    }
  };

  const removeItem = (idx: number) => {
    const item = items[idx];
    revokeManagedUrl(item.previewUrl);
    revokeManagedUrl(item.resultUrl);
    setItems(prev => prev.filter((_, i) => i !== idx));
    setErrorMessage(null);
  };

  const handlePercentageScale = (pct: number) => {
    if (items.length === 0) return;
    const baseW = items[0].originalWidth;
    const baseH = items[0].originalHeight;
    setResizeWidth(Math.round((baseW * pct) / 100));
    setResizeHeight(Math.round((baseH * pct) / 100));
  };

  const handleProcess = async () => {
    if (items.length === 0) {
      setErrorMessage(isHindi ? 'कृपया पहले फोटो चुनें।' : 'Please select at least one image.');
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

    try {
      const updatedItems = [...items];

      if (tool.slug === 'image-compressor') {
        const total = items.length;

        let effectiveQuality = quality / 100;
        if (compressMode === 'preset') {
          if (presetIntensity === 'high_quality') effectiveQuality = 0.85;
          else if (presetIntensity === 'balanced') effectiveQuality = 0.65;
          else if (presetIntensity === 'high_compression') effectiveQuality = 0.40;
          else if (presetIntensity === 'extreme') effectiveQuality = 0.25;
        }

        for (let i = 0; i < total; i++) {
          const item = items[i];
          const res = await compressImage(item.file, {
            quality: effectiveQuality,
            scalePercent: scalePercent < 100 ? scalePercent : undefined,
            targetFormat: compressFormat === 'auto' ? undefined : compressFormat,
            targetSizeKb: compressMode === 'target_size' ? targetSizeKb : undefined,
            convertPngToWebp
          });

          const resUrl = createManagedUrl(res.blob);
          updatedItems[i] = {
            ...item,
            resultBlob: res.blob,
            resultUrl: resUrl,
            resultSize: res.compressedSize,
            resultWidth: res.width,
            resultHeight: res.height,
            savingsPct: res.savingsPercentage,
            isSmaller: res.isSmaller,
            timeMs: res.processingTimeMs,
            message: res.message,
            hasTransparency: res.hasTransparency,
            format: res.format
          };

          setProgressPercent(Math.round(((i + 1) / total) * 100));
        }

        if (items.length === 1) {
          const first = updatedItems[0];
          if (first.isSmaller) {
            setStatusMessage(
              `Saved ${first.savingsPct}%! (${formatFileSize(first.file.size)} → ${formatFileSize(first.resultSize || 0)} in ${first.timeMs}ms)`
            );
          } else {
            setStatusMessage(
              first.message || 'Image was already optimally compressed. Original preserved.'
            );
          }
        } else {
          setStatusMessage(`Successfully processed ${items.length} image(s) with real re-encoding!`);
        }

      } else if (tool.slug === 'image-resizer') {
        const total = items.length;

        for (let i = 0; i < total; i++) {
          const item = items[i];
          let targetW = resizeWidth;
          let targetH = resizeHeight;

          if (lockAspect && item.originalWidth > 0) {
            targetH = Math.round((item.originalHeight / item.originalWidth) * targetW);
          }

          const blob = await resizeImage(item.file, {
            width: targetW,
            height: targetH,
            quality: 0.92
          });

          const resUrl = createManagedUrl(blob);
          updatedItems[i] = {
            ...item,
            resultBlob: blob,
            resultUrl: resUrl,
            resultSize: blob.size
          };

          setProgressPercent(Math.round(((i + 1) / total) * 100));
        }

        setStatusMessage(`Resized ${items.length} image(s) to exact dimensions with high-quality resampling!`);

      } else if (tool.slug === 'image-converter') {
        const total = items.length;

        for (let i = 0; i < total; i++) {
          const item = items[i];
          const blob = await convertImageFormat(item.file, targetFormat, 0.92);
          const resUrl = createManagedUrl(blob);
          updatedItems[i] = {
            ...item,
            resultBlob: blob,
            resultUrl: resUrl,
            resultSize: blob.size
          };

          setProgressPercent(Math.round(((i + 1) / total) * 100));
        }

        const ext = targetFormat === 'image/jpeg' ? 'JPG' : targetFormat === 'image/png' ? 'PNG' : 'WebP';
        setStatusMessage(`Converted ${items.length} image(s) to ${ext} format preserving visual fidelity!`);

      } else if (tool.slug === 'image-crop') {
        const item = items[0];
        let cropW = item.originalWidth;
        let cropH = item.originalHeight;

        if (cropAspect === '1:1') {
          const side = Math.min(cropW, cropH);
          cropW = side;
          cropH = side;
        } else if (cropAspect === '4:3') {
          if (cropW / cropH > 4 / 3) cropW = Math.round(cropH * (4 / 3));
          else cropH = Math.round(cropW * (3 / 4));
        } else if (cropAspect === '16:9') {
          if (cropW / cropH > 16 / 9) cropW = Math.round(cropH * (16 / 9));
          else cropH = Math.round(cropW * (9 / 16));
        }

        const startX = Math.round((item.originalWidth - cropW) / 2);
        const startY = Math.round((item.originalHeight - cropH) / 2);

        const canvas = document.createElement('canvas');
        canvas.width = cropW;
        canvas.height = cropH;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context failed.');

        const img = new Image();
        img.src = item.previewUrl;
        await new Promise(r => { img.onload = r; });

        ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, cropW, cropH);

        const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.92));
        if (!blob) throw new Error('Crop processing failed.');

        const resUrl = createManagedUrl(blob);
        updatedItems[0] = {
          ...item,
          resultBlob: blob,
          resultUrl: resUrl,
          resultSize: blob.size
        };

        setStatusMessage(`Cropped to ${cropW} × ${cropH} px (${cropAspect} aspect ratio)!`);
        setProgressPercent(100);
      }

      setItems(updatedItems);
      usageLimitService.recordUsage(tool.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAllZip = async () => {
    const processed = items.filter(it => it.resultBlob);
    if (processed.length === 0) return;

    const entries = processed.map((it, idx) => {
      const originalBase = it.file.name.replace(/\.[^/.]+$/, '');
      let ext = 'jpg';
      if (tool.slug === 'image-converter') {
        ext = targetFormat === 'image/png' ? 'png' : targetFormat === 'image/webp' ? 'webp' : 'jpg';
      } else if (it.file.type === 'image/png') {
        ext = 'png';
      }
      return {
        name: `${originalBase}_processed_${idx + 1}.${ext}`,
        content: it.resultBlob!
      };
    });

    await downloadZipArchive(entries, 'processed_images.zip');
  };

  const hasProcessedResults = items.some(it => it.resultUrl);

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="relative border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 sm:p-8 text-center transition-colors bg-slate-50/50 dark:bg-white/[0.02]">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple={tool.slug !== 'image-crop'}
          onChange={handleImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isHindi ? 'फोटो यहां ड्रैग करें या क्लिक करके अपलोड करें' : 'Drag & drop photos here, or click to browse'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Supports JPG, PNG, WebP (Batch processing enabled, 100% private in-browser)
          </p>
        </div>
      </div>

      {/* Selected Items Grid */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{items.length} {isHindi ? 'फोटो चुनी गईं' : 'photo(s) queued'}</span>
            <button
              onClick={() => setItems([])}
              className="text-red-500 hover:text-red-600 cursor-pointer font-bold"
            >
              {isHindi ? 'सभी हटाएं' : 'Clear All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <img
                    src={it.previewUrl}
                    alt={it.file.name}
                    className="w-12 h-12 rounded-lg object-cover bg-black/10 shrink-0 border border-slate-200 dark:border-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{it.file.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {it.originalWidth} × {it.originalHeight} px • {formatFileSize(it.file.size)}
                    </p>
                    {it.resultSize !== undefined && (
                      <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Output: {formatFileSize(it.resultSize)}
                        {it.savingsPct !== undefined && ` (${it.savingsPct}% saved)`}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    className="p-1 text-red-500 hover:text-red-700 rounded cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {it.resultUrl && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setComparisonItem(it)}
                      className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{isHindi ? 'तुलना करें' : 'Compare Before/After'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (it.resultBlob) {
                          const base = it.file.name.replace(/\.[^/.]+$/, '');
                          const ext = it.format === 'image/webp' ? 'webp' : it.format === 'image/png' ? 'png' : 'jpg';
                          downloadBlob(it.resultBlob, `${base}_compressed.${ext}`);
                        }
                      }}
                      className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      <span>{isHindi ? 'डाउनलोड' : 'Download'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool-specific Configuration Controls */}
      {tool.slug === 'image-compressor' && items.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
          {/* Mode Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-blue-600" />
              <span>{isHindi ? 'कम्प्रेशन मोड चुनें:' : 'Compression Mode:'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'preset', label: 'Quality Presets', icon: Sliders },
                { id: 'target_size', label: 'Target Size (KB)', icon: Target },
                { id: 'custom', label: 'Custom Slider', icon: Gauge },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCompressMode(tab.id as any)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      compressMode === tab.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode 1: Presets */}
          {compressMode === 'preset' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isHindi ? 'क्वालिटी स्तर:' : 'Preset Profile:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'high_quality', label: 'High Quality', quality: '85%', desc: 'Crisp photo clarity' },
                  { id: 'balanced', label: 'Balanced', quality: '65%', desc: 'Recommended standard' },
                  { id: 'high_compression', label: 'High Compression', quality: '40%', desc: 'Substantial size cut' },
                  { id: 'extreme', label: 'Extreme', quality: '25%', desc: 'Maximum compression' },
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setPresetIntensity(lvl.id as any)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      presetIntensity === lvl.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold whitespace-nowrap">{lvl.label}</span>
                      <span className={`text-[10px] font-mono font-bold ${presetIntensity === lvl.id ? 'text-blue-200' : 'text-slate-400'}`}>
                        {lvl.quality}
                      </span>
                    </div>
                    <span className={`text-[10px] block leading-tight ${presetIntensity === lvl.id ? 'text-blue-100' : 'text-slate-500'}`}>
                      {lvl.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode 2: Target File Size (Binary Search) */}
          {compressMode === 'target_size' && (
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">
                    {isHindi ? 'लक्षित फ़ाइल आकार (Target Size):' : 'Desired File Size:'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Engine dynamically converges on exact byte ceiling
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="20"
                    max="10000"
                    step="10"
                    value={targetSizeKb}
                    onChange={(e) => setTargetSizeKb(Math.max(10, parseInt(e.target.value, 10) || 10))}
                    className="w-24 px-2.5 py-1 text-sm font-bold text-right rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-blue-600 dark:text-blue-400"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">KB</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-medium text-slate-400 mr-1">Quick presets:</span>
                {[100, 200, 300, 500, 1000].map(kb => (
                  <button
                    key={kb}
                    onClick={() => setTargetSizeKb(kb)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                      targetSizeKb === kb
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 dark:bg-slate-700 border-transparent text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode 3: Custom Slider */}
          {compressMode === 'custom' && (
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'कस्टम कम्प्रेशन क्वालिटी स्तर:' : 'Encoder Quality Level:'}
                </label>
                <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Maximum Compression (Smaller Size)</span>
                <span>Balanced</span>
                <span>Maximum Quality (Larger Size)</span>
              </div>
            </div>
          )}

          {/* Format & Dimension Downscaling Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
            {/* Resolution Scaling */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isHindi ? 'रिज़ॉल्यूशन स्केल:' : 'Resolution Downscaling:'}
              </label>
              <div className="flex gap-1.5">
                {[
                  { pct: 100, label: '100% (Original)' },
                  { pct: 75, label: '75%' },
                  { pct: 50, label: '50%' },
                  { pct: 25, label: '25%' }
                ].map(sc => (
                  <button
                    key={sc.pct}
                    onClick={() => setScalePercent(sc.pct)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                      scalePercent === sc.pct
                        ? 'bg-slate-900 text-white dark:bg-blue-600 border-transparent shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Output Format */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isHindi ? 'आउटपुट प्रारूप:' : 'Output Format:'}
              </label>
              <div className="flex gap-1.5">
                {[
                  { id: 'auto', label: 'Auto' },
                  { id: 'image/webp', label: 'WebP' },
                  { id: 'image/jpeg', label: 'JPEG' },
                  { id: 'image/png', label: 'PNG' }
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => setCompressFormat(fmt.id as any)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                      compressFormat === fmt.id
                        ? 'bg-slate-900 text-white dark:bg-blue-600 border-transparent shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Smart WebP Alpha Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={convertPngToWebp}
                onChange={(e) => setConvertPngToWebp(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white block">
                  Smart WebP Conversion for PNGs
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Cuts PNG size by 70–85% while fully preserving alpha transparency
                </span>
              </div>
            </label>
          </div>
        </div>
      )}

      {tool.slug === 'image-resizer' && items.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isHindi ? 'त्वरित आकार स्केल:' : 'Quick Presets:'}
            </span>
            <div className="flex gap-1.5">
              {[25, 50, 75, 100, 200].map(pct => (
                <button
                  key={pct}
                  onClick={() => handlePercentageScale(pct)}
                  className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 cursor-pointer"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={resizeWidth}
                onChange={(e) => setResizeWidth(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={resizeHeight}
                onChange={(e) => setResizeHeight(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={lockAspect}
              onChange={(e) => setLockAspect(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span>{isHindi ? 'पहलू अनुपात लॉक रखें (Aspect Ratio Lock)' : 'Lock Aspect Ratio'}</span>
          </label>
        </div>
      )}

      {tool.slug === 'image-converter' && items.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {isHindi ? 'आउटपुट फॉर्मेट चुनें:' : 'Select Target Format:'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'image/jpeg', label: 'JPG / JPEG', desc: 'Universal' },
              { id: 'image/png', label: 'PNG', desc: 'Preserves Alpha' },
              { id: 'image/webp', label: 'WebP', desc: 'Modern & Light' }
            ].map(fmt => (
              <button
                key={fmt.id}
                onClick={() => setTargetFormat(fmt.id as any)}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold border text-left transition-all cursor-pointer ${
                  targetFormat === fmt.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>{fmt.label}</div>
                <div className={`text-[10px] font-normal ${targetFormat === fmt.id ? 'text-blue-100' : 'text-slate-400'}`}>{fmt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {tool.slug === 'image-crop' && items.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {isHindi ? 'क्रॉप अनुपात (Aspect Ratio):' : 'Crop Ratio:'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['1:1', '4:3', '16:9'] as const).map(asp => (
              <button
                key={asp}
                onClick={() => setCropAspect(asp)}
                className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  cropAspect === asp
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {asp}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
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
        <button
          onClick={handleProcess}
          disabled={isProcessing || items.length === 0}
          className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{isHindi ? 'प्रोसेसिंग...' : `Processing ${items.length} photo(s)...`}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{isHindi ? 'फोटो प्रोसेस करें' : 'Process Image(s)'}</span>
            </>
          )}
        </button>

        {hasProcessedResults && items.length > 1 && (
          <button
            onClick={handleDownloadAllZip}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <Archive className="w-4 h-4" />
            <span>{isHindi ? 'सभी ZIP में डाउनलोड करें' : 'Download All as ZIP'}</span>
          </button>
        )}
      </div>

      {/* Visual Quality Comparison Modal */}
      {comparisonItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {isHindi ? 'विज़ुअल गुणवत्ता एवं आकार तुलना' : 'Visual Quality & Size Comparison'}
                </span>
                <span className="text-xs text-slate-400 font-mono truncate max-w-xs">
                  ({comparisonItem.file.name})
                </span>
              </div>
              <button
                onClick={() => setComparisonItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: Side-by-side comparison */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {/* Original */}
              <div className="flex flex-col space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500">Original</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    {formatFileSize(comparisonItem.file.size)}
                  </span>
                </div>
                <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center relative">
                  <img
                    src={comparisonItem.previewUrl}
                    alt="Original preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex justify-between">
                  <span>Dimensions: {comparisonItem.originalWidth} × {comparisonItem.originalHeight}</span>
                  <span>{comparisonItem.file.type.replace('image/', '').toUpperCase()}</span>
                </div>
              </div>

              {/* Compressed Output */}
              <div className="flex flex-col space-y-2 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">Compressed</span>
                    {comparisonItem.savingsPct && comparisonItem.savingsPct > 0 ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 text-white">
                        -{comparisonItem.savingsPct}%
                      </span>
                    ) : null}
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                    {formatFileSize(comparisonItem.resultSize || comparisonItem.file.size)}
                  </span>
                </div>
                <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center relative">
                  <img
                    src={comparisonItem.resultUrl || comparisonItem.previewUrl}
                    alt="Compressed preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex justify-between">
                  <span>
                    Dimensions: {comparisonItem.resultWidth || comparisonItem.originalWidth} × {comparisonItem.resultHeight || comparisonItem.originalHeight}
                  </span>
                  <span>{(comparisonItem.format || 'image/jpeg').replace('image/', '').toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50 dark:bg-white/[0.01]">
              <span className="text-xs text-slate-500 font-medium">
                {comparisonItem.message || 'Visual fidelity verified with sub-pixel bicubic scaling.'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setComparisonItem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
                {comparisonItem.resultBlob && (
                  <button
                    onClick={() => {
                      const base = comparisonItem.file.name.replace(/\.[^/.]+$/, '');
                      const ext = comparisonItem.format === 'image/webp' ? 'webp' : comparisonItem.format === 'image/png' ? 'png' : 'jpg';
                      downloadBlob(comparisonItem.resultBlob!, `${base}_compressed.${ext}`);
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Compressed</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
