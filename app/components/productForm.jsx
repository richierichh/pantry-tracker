// ProductForm.js
import React, { useState } from "react";
import { useSubmitForm } from "./useSubmitForm";

export default function ProductForm({ onClose, addProductToTable }) {
  const { submitForm } = useSubmitForm();
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedExpiresDate, setSelectedExpiresDate] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      product: e.target.product.value,
      quantity: e.target.quantity.value,
      addedOn: selectedDate ? selectedDate.toString() : 'N/A',
      expiresOn: selectedExpiresDate ? selectedExpiresDate.toString() : 'N/A',
    };

    try {
      const id = await submitForm(formData, capturedImage);
      addProductToTable({ ...formData, id });
      onClose();
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form onSubmit={handleFormSubmit} className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        {/* Form Fields for Product, Quantity, Dates, and Capture Button */}
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            Add To Pantry
          </button>
        </div>
      </form>
    </div>
  );
}
