/**
 * LESS CREATION — Production-Grade PDF Engine
 * 
 * Powered by pdf-lib:
 * - Real PDF merging with page order preservation
 * - Real PDF splitting with page range syntax ("1-3, 5, 7-10")
 * - Real page rotation (90, 180, 270 deg)
 * - Real Image-to-PDF compilation with orientation preservation and A4/Fit modes
 * - Real metadata reading and updating
 * - Meaningful error messages for encrypted/corrupted files
 */

import { PDFDocument, degrees, PageSizes, rgb } from 'pdf-lib';
import { validateUploadedFile } from './fileEngine';

export interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount: number;
}

export interface SplitPageResult {
  pageNumber: number;
  pdfBytes: Uint8Array;
  filename: string;
}

/**
 * Validates and safely loads a PDF document from an ArrayBuffer or File
 */
export async function loadPdfDocument(source: File | ArrayBuffer): Promise<PDFDocument> {
  let arrayBuffer: ArrayBuffer;
  if (source instanceof File) {
    const validation = await validateUploadedFile(source, { allowedTypes: ['pdf'] });
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid PDF file.');
    }
    arrayBuffer = await source.arrayBuffer();
  } else {
    arrayBuffer = source;
  }

  try {
    const pdfDoc = await PDFDocument.load(arrayBuffer, { 
      ignoreEncryption: false,
      updateMetadata: false 
    });
    return pdfDoc;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes('encrypted') || errorMsg.includes('password')) {
      throw new Error('This PDF is password-protected. Please unlock or decrypt it before processing.');
    }
    if (errorMsg.includes('corrupt') || errorMsg.includes('header') || errorMsg.includes('trailer')) {
      throw new Error('This PDF appears to be corrupted or incompletely downloaded.');
    }
    throw new Error(`Unable to read PDF: ${errorMsg}`);
  }
}

/**
 * Extracts detailed metadata from a PDF
 */
export async function inspectPdf(file: File): Promise<PdfMetadata> {
  const pdfDoc = await loadPdfDocument(file);
  const pageCount = pdfDoc.getPageCount();

  const title = pdfDoc.getTitle() || undefined;
  const author = pdfDoc.getAuthor() || undefined;
  const subject = pdfDoc.getSubject() || undefined;
  const creator = pdfDoc.getCreator() || undefined;
  const producer = pdfDoc.getProducer() || undefined;
  const creationDate = pdfDoc.getCreationDate()?.toLocaleDateString() || undefined;
  const modificationDate = pdfDoc.getModificationDate()?.toLocaleDateString() || undefined;

  return {
    title,
    author,
    subject,
    creator,
    producer,
    creationDate,
    modificationDate,
    pageCount
  };
}

/**
 * Merges multiple PDF files into a single consolidated PDF document
 */
export async function mergePdfFiles(
  files: File[],
  onProgress?: (progress: number, currentFileName: string) => void
): Promise<Uint8Array> {
  if (!files || files.length < 2) {
    throw new Error('Please select at least 2 PDF documents to merge.');
  }

  const mergedPdf = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    if (onProgress) {
      onProgress(Math.round(((i) / total) * 100), file.name);
    }

    const doc = await loadPdfDocument(file);
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  if (onProgress) {
    onProgress(100, 'Finalizing merged document...');
  }

  return await mergedPdf.save();
}

/**
 * Parses user range strings like "1-3, 5, 8-10" into zero-based page indices
 */
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  if (!rangeStr.trim()) {
    // Return all pages if empty
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const indices = new Set<number>();
  const parts = rangeStr.split(/[,;\s]+/).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let p = min; p <= max; p++) {
          indices.add(p - 1); // 0-based
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        indices.add(page - 1); // 0-based
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Splits a PDF by extracting specific page ranges into a new consolidated PDF
 */
export async function splitPdfByRange(
  file: File,
  rangeExpression: string,
  onProgress?: (progress: number) => void
): Promise<{ pdfBytes: Uint8Array; extractedPageCount: number }> {
  const sourceDoc = await loadPdfDocument(file);
  const totalPages = sourceDoc.getPageCount();

  const selectedIndices = parsePageRange(rangeExpression, totalPages);
  if (selectedIndices.length === 0) {
    throw new Error(`Invalid page range. This document has ${totalPages} pages (1 to ${totalPages}).`);
  }

  if (onProgress) onProgress(30);

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(sourceDoc, selectedIndices);
  copiedPages.forEach(page => newDoc.addPage(page));

  if (onProgress) onProgress(80);

  const pdfBytes = await newDoc.save();
  if (onProgress) onProgress(100);

  return {
    pdfBytes,
    extractedPageCount: copiedPages.length
  };
}

/**
 * Extracts each page of a PDF into an individual separate PDF document
 */
export async function extractAllPdfPages(
  file: File,
  onProgress?: (progress: number) => void
): Promise<SplitPageResult[]> {
  const sourceDoc = await loadPdfDocument(file);
  const totalPages = sourceDoc.getPageCount();
  const results: SplitPageResult[] = [];

  const baseName = file.name.replace(/\.[^/.]+$/, '');

  for (let i = 0; i < totalPages; i++) {
    const singleDoc = await PDFDocument.create();
    const [copiedPage] = await singleDoc.copyPages(sourceDoc, [i]);
    singleDoc.addPage(copiedPage);
    const pdfBytes = await singleDoc.save();

    results.push({
      pageNumber: i + 1,
      pdfBytes,
      filename: `${baseName}_page_${i + 1}.pdf`
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalPages) * 100));
    }
  }

  return results;
}

/**
 * Rotates pages in a PDF document by 90, 180, or 270 degrees
 */
export async function rotatePdfPages(
  file: File,
  rotationAngle: 90 | 180 | 270,
  targetPageNumbers?: number[] // 1-based, or all if undefined
): Promise<Uint8Array> {
  const doc = await loadPdfDocument(file);
  const pages = doc.getPages();

  pages.forEach((page, index) => {
    const pageNum = index + 1;
    if (!targetPageNumbers || targetPageNumbers.includes(pageNum)) {
      const currentRotation = page.getRotation().angle;
      const newAngle = (currentRotation + rotationAngle) % 360;
      page.setRotation(degrees(newAngle));
    }
  });

  return await doc.save();
}

/**
 * Compiles a list of image files into a standardized PDF document
 */
export async function compileImagesToPdf(
  images: File[],
  pageSizeMode: 'fit' | 'a4' | 'letter' = 'fit',
  margin: number = 20,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  if (!images || images.length === 0) {
    throw new Error('Please select at least one image to create a PDF.');
  }

  const pdfDoc = await PDFDocument.create();
  const total = images.length;

  for (let i = 0; i < total; i++) {
    const imageFile = images[i];
    const buffer = await imageFile.arrayBuffer();

    let embeddedImage;
    if (imageFile.type === 'image/png' || imageFile.name.toLowerCase().endsWith('.png')) {
      embeddedImage = await pdfDoc.embedPng(buffer);
    } else {
      // Default to JPEG embedding (JPEG, WebP/Canvas converted)
      embeddedImage = await pdfDoc.embedJpg(buffer);
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    if (pageSizeMode === 'fit') {
      // Match PDF page size exactly to image dimensions
      const page = pdfDoc.addPage([imgWidth, imgHeight]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight
      });
    } else {
      // Standard A4 or Letter with proportional scaling
      const standardSize = pageSizeMode === 'letter' ? PageSizes.Letter : PageSizes.A4;
      const page = pdfDoc.addPage(standardSize);
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      // Scale to fit while maintaining aspect ratio
      const scaleFactor = Math.min(
        availableWidth / imgWidth,
        availableHeight / imgHeight
      );

      const scaledWidth = imgWidth * scaleFactor;
      const scaledHeight = imgHeight * scaleFactor;

      // Center horizontally and vertically
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      page.drawImage(embeddedImage, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight
      });
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  return await pdfDoc.save();
}

/**
 * Updates metadata fields inside a PDF document
 */
export async function updatePdfMetadata(
  file: File,
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    producer?: string;
  }
): Promise<Uint8Array> {
  const doc = await loadPdfDocument(file);

  if (metadata.title !== undefined) doc.setTitle(metadata.title);
  if (metadata.author !== undefined) doc.setAuthor(metadata.author);
  if (metadata.subject !== undefined) doc.setSubject(metadata.subject);
  if (metadata.keywords !== undefined) doc.setKeywords(metadata.keywords);
  if (metadata.producer !== undefined) doc.setProducer(metadata.producer || 'Less Creation Tools');

  doc.setModificationDate(new Date());

  return await doc.save();
}

import {
  compressPdfDocument,
  analyzePdfDocument,
  resolvePdfParameters
} from './pdfCompressionEngine';
export type {
  PdfClassification,
  PdfCompressionOptions,
  PdfCompressionResult,
  PdfAnalysisResult,
  PdfCompressionIntensity,
  PdfCompressionPreset
} from './pdfCompressionEngine';
export { compressPdfDocument, analyzePdfDocument, resolvePdfParameters };

/**
 * Optimizes and compacts PDF internal structure with real embedded image compression.
 */
export async function optimizePdf(
  file: File,
  level: 'basic' | 'balanced' | 'strong' = 'balanced',
  onProgress?: (progress: number) => void
): Promise<{ pdfBytes: Uint8Array; originalSize: number; optimizedSize: number }> {
  const intensityMap: Record<'basic' | 'balanced' | 'strong', 'low' | 'balanced' | 'high'> = {
    basic: 'low',
    balanced: 'balanced',
    strong: 'high'
  };
  const result = await compressPdfDocument(
    file,
    { intensity: intensityMap[level] },
    (percent) => {
      if (onProgress) onProgress(percent);
    }
  );

  return {
    pdfBytes: result.pdfBytes,
    originalSize: result.originalSize,
    optimizedSize: result.compressedSize
  };
}

