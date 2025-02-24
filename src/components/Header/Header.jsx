import "./Header.css";

function Header({ user }) {
  return (
    <header className="header">
      <div className="logo">Social Feed</div>
      <div className="user-info">
        <img src={user.avatar} alt={user.name} className="avatar" />
        <span className="username">{user.name}</span>
      </div>
    </header>
  );
}

export default Header;
