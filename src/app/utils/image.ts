/**
 * Compresses an image file using Canvas and returns a Promise with the compressed JPEG base64 string.
 * Falls back to the original base64 if compression fails.
 */
export const compressImage = (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const originalBase64 = event.target?.result as string;
      const img = new Image();
      img.src = originalBase64;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate target dimensions maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(originalBase64);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with the given quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        } catch (e) {
          console.warn('Canvas image compression failed, using original base64:', e);
          resolve(originalBase64);
        }
      };
      img.onerror = () => {
        resolve(originalBase64);
      };
    };
    reader.onerror = () => {
      resolve('');
    };
  });
};
