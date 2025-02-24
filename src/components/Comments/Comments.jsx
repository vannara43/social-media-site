import React from "react";
import "./Comments.css";

function Comments({
  postId,
  comments,
  commentingOn,
  handleComment,
  submitComment,
  newComment,
  setNewComment,
}) {
  return (
    <div className="post-comments">
      {comments[postId]?.map((comment) => (
        <div key={comment.id} className="comment">
          <img
            src={comment.avatar}
            alt={comment.author}
            className="avatar-small"
          />
          <div className="comment-content">
            <div className="comment-header">
              <span className="comment-author">{comment.author}</span>
              <span className="comment-time">
                {new Date(comment.timestamp).toLocaleString()}
              </span>
            </div>
            <p>{comment.content}</p>
          </div>
        </div>
      ))}
      {commentingOn === postId ? (
        <form
          onSubmit={(e) => submitComment(postId, e)}
          className="comment-form"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit">Send</button>
        </form>
      ) : (
        <button
          onClick={() => handleComment(postId)}
          className="comment-button"
        >
          💬 Comment
        </button>
      )}
    </div>
  );
}

export default Comments;
