import React from "react";
import Comments from "../Comments/Comments";
import "./Post.css";

function Post({
  post,
  user,
  handleEdit,
  handleDelete,
  handleLike,
  comments,
  commentingOn,
  handleComment,
  submitComment,
  newComment,
  setNewComment,
}) {
  return (
    <div className="post">
      <div className="post-header">
        <img src={post.avatar} alt={post.author} className="avatar-small" />
        <div className="post-info">
          <span className="post-author">{post.author}</span>
          <span className="post-time">
            {new Date(post.timestamp).toLocaleString()}
          </span>
        </div>
        {post.author === user.name && (
          <div className="post-controls">
            <button onClick={() => handleEdit(post)} className="edit-button">
              ✏️
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="delete-button"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      <div className="post-content">{post.content}</div>
      {post.image && (
        <div className="post-image">
          <img src={post.image} alt="Post content" />
        </div>
      )}
      <div className="post-actions">
        <button onClick={() => handleLike(post.id)} className="like-button">
          ❤️ {post.likes}
        </button>
        <button className="comment-button">💬 Comment</button>
        <button className="share-button">↗️ Share</button>
      </div>
      <Comments
        postId={post.id}
        comments={comments}
        commentingOn={commentingOn}
        handleComment={handleComment}
        submitComment={submitComment}
        newComment={newComment}
        setNewComment={setNewComment}
      />
    </div>
  );
}

export default Post;
