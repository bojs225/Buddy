import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="mb-10">
      <h1 className="glass-header">
        <Link to="/">Finance Buddy</Link>
      </h1>
    </div>
  );
};

export default Header;
