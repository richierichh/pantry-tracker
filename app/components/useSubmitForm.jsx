// useSubmitForm.js
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

const handleImageUpload = async (imageData) => {
  const storageRef = ref(storage, `images/${Date.now()}.png`);
  await uploadString(storageRef, imageData, 'data_url');
  const imageUrl = await getDownloadURL(storageRef);
  return imageUrl;
};

export const useSubmitForm = () => {
  const submitForm = async (formData, capturedImage) => {
    let imageUrl = capturedImage;
    if (capturedImage) {
      imageUrl = await handleImageUpload(capturedImage);
    }

    const newProduct = {
      ...formData,
      image: imageUrl,
    };

    try {
      const docRef = await addDoc(collection(db, "products"), newProduct);
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  return { submitForm };
};
