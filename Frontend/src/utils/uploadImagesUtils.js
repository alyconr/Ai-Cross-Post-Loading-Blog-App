// utils/fileUtils.js

// Convert file to base64 string with metadata
export const fileToBase64WithMetadata = (file) => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      reject(new Error('Input is not a valid File or Blob object'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      const metadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      };
      resolve({ base64String, metadata });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const imageToBase64 = (image) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64String = reader.result;
      const metadata = {
        name: image.name,
        type: image.type,
        size: image.size,
        lastModified: image.lastModified,
      };
      resolve({ base64String, metadata });
    };
    reader.onerror = (error) => reject(error);
  });
};

// Convert base64 string to file object
export const base64ToFile = (base64String, fileName, fileType) => {
  const arr = base64String.split(",");
  const mime = fileType || arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
};
