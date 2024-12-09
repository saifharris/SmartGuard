import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <h2>System</h2>
      {user ? (
        <>
          <Link to="/">Dashboard</Link>
          <Link to="/video">Videos</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
