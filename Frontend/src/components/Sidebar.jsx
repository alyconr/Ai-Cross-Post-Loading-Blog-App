import React, { useContext } from "react";
import styled from "styled-components";
import { MdOutlineOpenInNew } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Sidebar = ({ menuOpen, setMenuOpen }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleToggle = (event) => {
    event.preventDefault();
    setMenuOpen(!menuOpen);
  };
  return (
    <SidebarContainer $isOpen={menuOpen}>
      <ToggleButton onClick={handleToggle}>
        {menuOpen ? (
          <IoCloseCircleOutline size={35} />
        ) : (
          <MdOutlineOpenInNew size={35} />
        )}
      </ToggleButton>

      <MenuItems $isOpen={menuOpen}>
        <MenuItem as={Link} to={`/profile/${currentUser?.user.username}`}>
          Profile
        </MenuItem>
        <MenuItem as={Link} to={`/profile/${currentUser?.user.username}/posts`}>
          Your Local Posts
        </MenuItem>
        <MenuItem as={Link} to={`/settings/${currentUser?.user.username}`}>
          Settings
        </MenuItem>
        <MenuItem
          as={Link}
          to={`/profile/${currentUser?.user.username}/bookmarks`}
        >
          Reading List
        </MenuItem>
      </MenuItems>
    </SidebarContainer>
  );
};

export default Sidebar;
const SidebarContainer = styled.div`
  width: ${({ $isOpen }) => ($isOpen ? "250px" : "50px")};
  transition: width 0.3s;
  background-color: #343a40;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ToggleButton = styled.div`
  width: auto;
  background: none;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
`;

const MenuItems = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  padding: 10px;
  text-decoration: none;
`;

const MenuItem = styled(Link)`
  display: flex;
  padding: 10px 0;
  cursor: pointer;
  font-size: 20px;
  text-decoration: none;
  color: white;
  &:hover {
    background-color: #495057;
  }
`;
