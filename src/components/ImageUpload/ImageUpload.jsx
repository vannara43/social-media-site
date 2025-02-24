import React from "react";
import "./ImageUpload.css";

function ImageUpload({ handleImageChange, previewImage, removeImage }) {
  return (
    <div className="image-upload">
      {previewImage ? (
        <div className="image-preview">
          <img src={previewImage} alt="Preview" />
          <button type="button" className="remove-image" onClick={removeImage}>
            ✕
          </button>
        </div>
      ) : (
        <label className="upload-label">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
          <span>📷 Add Photo</span>
        </label>
      )}
    </div>
  );
}

export default ImageUpload;
