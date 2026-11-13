import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadResult {
  url: string;
  name: string;
  size: string;
  type: 'image' | 'pdf';
}

/**
 * Comprime a imagem no cliente antes de qualquer upload.
 * Reduz fotos pesadas de celulares (10-25MB) para ~150-300KB quase instantaneamente.
 */
export async function compressImage(file: File, maxWidth = 1280, quality = 0.72): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          resolve(blob || file);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Upload ultra-rápido: comprime primeiro, tenta Firebase Storage com timeout de 4s,
 * e se o Storage demorar ou falhar, usa base64 comprimido instantâneo.
 */
export async function uploadSingleAttachment(file: File, folder = 'attachments'): Promise<UploadResult> {
  const isImage = file.type.startsWith('image/');
  const compressedBlob = isImage ? await compressImage(file) : file;
  const formattedSize = formatFileSize(compressedBlob.size);

  const extension = file.name.split('.').pop() || 'jpg';
  const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extension}`;
  const storagePath = `${folder}/${cleanName}`;
  const fileRef = ref(storage, storagePath);

  // Tentativa de envio ao Storage com timeout de 4 segundos para nunca travar
  const uploadWithTimeout = new Promise<string>(async (resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Storage timeout - fallback rápido ativado'));
    }, 4000);

    try {
      const snapshot = await uploadBytes(fileRef, compressedBlob, {
        contentType: isImage ? 'image/jpeg' : file.type
      });
      clearTimeout(timer);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      resolve(downloadUrl);
    } catch (err) {
      clearTimeout(timer);
      reject(err);
    }
  });

  try {
    const url = await uploadWithTimeout;
    return {
      url,
      name: file.name,
      size: formattedSize,
      type: isImage ? 'image' : 'pdf'
    };
  } catch (error) {
    console.warn('Usando armazenamento rápido integrado:', error);
    const base64Url = await blobToBase64(compressedBlob);
    return {
      url: base64Url,
      name: file.name,
      size: formattedSize,
      type: isImage ? 'image' : 'pdf'
    };
  }
}

/**
 * Upload simultâneo (em paralelo) de múltiplos arquivos
 */
export async function uploadMultipleAttachments(
  files: File[], 
  folder = 'attachments',
  onProgress?: (current: number, total: number) => void
): Promise<UploadResult[]> {
  let completed = 0;
  const promises = files.map(async (file) => {
    const result = await uploadSingleAttachment(file, folder);
    completed++;
    if (onProgress) onProgress(completed, files.length);
    return result;
  });

  return Promise.all(promises);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
