// src/storageHelpers.js
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param {File} file - The file to upload.
 * @param {string} folder - Folder name in Firebase Storage (e.g., 'resumes/')
 * @returns {Promise<string>} - Downloadable URL of uploaded file.
 */

export const uploadFileToStorage = async (file, folder = 'uploads') => {
  try {
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to storage:', error);
    throw error;
  }
};
