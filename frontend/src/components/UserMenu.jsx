import React, { useState } from "react";
import { MdLogout } from "react-icons/md";

const UserMenu = ({ user, onLogout }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="user-menu-container">
      <div className="user-menu-trigger" onClick={toggleDropdown}>
        <img src={user.profilePicture} alt="Avatar" className="user-avatar" />
        <span className="user-greeting">Hello, {user.name}</span>
      </div>
      {dropdownVisible && (
        <div className="user-menu-dropdown">
          <button onClick={onLogout} className="logout-button">
            <MdLogout className="logout-icon" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
