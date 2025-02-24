import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import "./Post.css";

function Post({ post, user, handleEdit, handleDelete, handleLike }) {
  const isAuthor = post.user_id === user.id;

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    handleDelete(post.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    handleEdit(post);
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-header-left">
          <img
            src={
              // post.avatar_url ||
              "https://images.vexels.com/media/users/3/147101/isolated/preview/b4a49d4b864c74bb73de63f080ad7930-instagram-profile-button.png"
            }
            alt={post.author_name}
            className="avatar"
          />
          <div className="post-header-info">
            <h3>{post.author_name}</h3>
            <span className="post-date">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        {isAuthor && (
          <div className="post-actions">
            <button
              className="action-button edit"
              onClick={handleEditClick}
              title="Edit post"
            >
              <FaEdit />
            </button>
            <button
              className="action-button delete"
              onClick={handleDeleteClick}
              title="Delete post"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <div className="post-footer">
        <button
          className={`like-button ${post.liked ? "liked" : ""}`}
          onClick={() => handleLike(post.id)}
        >
          Like ({post.likes || 0})
        </button>
      </div>
    </div>
  );
}

export default Post;
