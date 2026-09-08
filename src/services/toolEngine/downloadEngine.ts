/**
 * LESS CREATION — Production-Grade Download Engine
 * 
 * Centralized file download, MIME negotiation, and batch ZIP archiving.
 * Guarantees clean DOM cleanup, proper extensions, and error handling.
 */

import JSZip from 'jszip';
import { sanitizeFilename } from './fileEngine';

export interface ZipFileEntry {
  name: string;
  content: Blob | Uint8Array | string;
}

/**
 * Triggers a direct browser file download for a Blob
 */
export function downloadBlob(blob: Blob, rawFilename: string): void {
  const filename = sanitizeFilename(rawFilename, 'download');
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);

  try {
    anchor.click();
  } finally {
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 200);
  }
}

/**
 * Triggers a download from a Data URL (e.g. Canvas image or QR code)
 */
export function downloadDataUrl(dataUrl: string, rawFilename: string): void {
  const filename = sanitizeFilename(rawFilename, 'download');
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);

  try {
    anchor.click();
  } finally {
    setTimeout(() => {
      document.body.removeChild(anchor);
    }, 200);
  }
}

/**
 * Downloads plain text, markdown, or JSON directly
 */
export function downloadTextFile(
  content: string,
  rawFilename: string,
  mimeType: string = 'text/plain;charset=utf-8'
): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, rawFilename);
}

/**
 * Creates a standard ZIP archive containing multiple files and triggers download
 */
export async function downloadZipArchive(
  files: ZipFileEntry[],
  zipFilename: string = 'archive.zip',
  onProgress?: (percent: number) => void
): Promise<void> {
  if (!files || files.length === 0) {
    throw new Error('No files provided for ZIP generation.');
  }

  const zip = new JSZip();

  // Handle duplicate filenames inside ZIP by adding index
  const usedNames = new Set<string>();

  for (const entry of files) {
    let cleanName = sanitizeFilename(entry.name, 'file');
    let candidateName = cleanName;
    let counter = 1;

    const dotIndex = cleanName.lastIndexOf('.');
    const base = dotIndex !== -1 ? cleanName.slice(0, dotIndex) : cleanName;
    const ext = dotIndex !== -1 ? cleanName.slice(dotIndex) : '';

    while (usedNames.has(candidateName.toLowerCase())) {
      candidateName = `${base}_${counter}${ext}`;
      counter++;
    }

    usedNames.add(candidateName.toLowerCase());
    zip.file(candidateName, entry.content);
  }

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    },
    metadata => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  const finalZipName = zipFilename.toLowerCase().endsWith('.zip')
    ? zipFilename
    : `${zipFilename}.zip`;

  downloadBlob(zipBlob, finalZipName);
}
