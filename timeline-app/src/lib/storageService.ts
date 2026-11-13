import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Faz upload de um arquivo direto para o Firebase Storage
 * com fallback para base64 comprimido local se Storage der erro de permissão/CORS.
 */
export async function uploadAttachment(file: File, folder = 'attachments'): Promise<{ url: string; name: string; size: string }> {
  const extension = file.name.split('.').pop() || 'jpg';
  const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
  const storagePath = `${folder}/${cleanName}`;
  const fileRef = ref(storage, storagePath);

  const formattedSize = formatFileSize(file.size);

  try {
    const snapshot = await uploadBytes(fileRef, file, {
      contentType: file.type || 'image/jpeg'
    });
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return {
      url: downloadUrl,
      name: file.name,
      size: formattedSize
    };
  } catch (error) {
    console.warn('Falha no upload para o Firebase Storage (usando fallback base64 comprimido):', error);
    // Fallback: Converte imagem comprimida em dataUrl para não impedir o usuário de salvar
    const base64Url = await compressAndConvertToBase64(file);
    return {
      url: base64Url,
      name: file.name,
      size: formattedSize
    };
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Redimensiona e comprime imagens de câmeras mobile (que costumam ter 10MB+)
 * para caber perfeitamente no Firestore/Storage e carregar instantaneamente.
 */
function compressAndConvertToBase64(file: File, maxWidth = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

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
        resolve(img.src);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };

    img.onerror = () => {
      // Se der erro ao decodificar imagem, lê arquivo normal
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.readAsDataURL(file);
    };

    reader.readAsDataURL(file);
  });
}

