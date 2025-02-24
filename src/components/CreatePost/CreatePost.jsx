import React from "react";
import ImageUpload from "../ImageUpload/ImageUpload";
import "./CreatePost.css";

function CreatePost({
  newPost,
  setNewPost,
  handleSubmit,
  editingPost,
  cancelEdit,
  previewImage,
  handleImageChange,
  removeImage,
}) {
  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder={
            editingPost ? "Edit your post..." : "What's on your mind?"
          }
          rows="4"
        />
        <ImageUpload
          handleImageChange={handleImageChange}
          previewImage={previewImage}
          removeImage={removeImage}
        />
        <div className="form-buttons">
          {editingPost && (
            <button
              type="button"
              onClick={cancelEdit}
              className="cancel-button"
            >
              Cancel
            </button>
          )}
          <button type="submit">{editingPost ? "Save Changes" : "Post"}</button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
