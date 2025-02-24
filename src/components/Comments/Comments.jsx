import { useState } from "react";
import "./Comments.css";

function Comments({ comments, postId, user, onAddComment }) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(postId, {
      content: newComment,
      author_name: user.name,
      avatar_url: user.avatar,
      created_at: new Date().toISOString(),
    });
    setNewComment("");
  };

  return (
    <div className="comments-section">
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input"
        />
        <button type="submit" className="comment-submit">
          Post
        </button>
      </form>

      <div className="comments-list">
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment.id || index} className="comment">
              <img
                src={comment.avatar_url || "https://via.placeholder.com/30"}
                alt={comment.author_name}
                className="comment-avatar"
              />
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.author_name}</span>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-comments">No comments yet</p>
        )}
      </div>
    </div>
  );
}

export default Comments;
