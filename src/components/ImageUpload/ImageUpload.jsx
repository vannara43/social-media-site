import { useState } from "react";
import "./ImageUpload.css";

function ImageUpload({ onImageUpload, selectedImage }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onImageUpload(data.imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        id="file-input"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <label htmlFor="file-input" className="upload-button">
        {uploading ? "Uploading..." : "Upload Image"}
      </label>

      {selectedImage && (
        <div className="image-preview">
          <img src={selectedImage} alt="Preview" />
          <button
            type="button"
            className="remove-button"
            onClick={() => onImageUpload(null)}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
