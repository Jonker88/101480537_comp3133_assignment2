const DEFAULT_MAX = 2 * 1024 * 1024;

export function readImageAsDataUrl(file: File, maxBytes: number = DEFAULT_MAX): Promise<string> {
  if (file.size > maxBytes) {
    return Promise.reject(new Error(`Image must be ${Math.floor(maxBytes / (1024 * 1024))} MB or smaller`));
  }
  if (!file.type.startsWith('image/')) {
    return Promise.reject(new Error('Please choose an image file (PNG, JPEG, GIF, or WebP)'));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the selected file'));
    reader.readAsDataURL(file);
  });
}
