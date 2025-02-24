import "./CreatePost.css";

function CreatePost({
  newPost,
  setNewPost,
  handleSubmit,
  editingPost,
  cancelEdit,
  children,
}) {
  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
        />
        {children} {/* This will render the ImageUpload component */}
        <div className="form-buttons">
          <button type="submit">
            {editingPost ? "Update Post" : "Create Post"}
          </button>
          {editingPost && (
            <button type="button" className="secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
