import styled from "styled-components";
import { MdOutlineOpenInNew } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Sidebar = ({ menuOpen, setMenuOpen, setActiveComponent }) => {
  const handleToggle = (event) => {
    event.preventDefault();
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = (component) => {
    setActiveComponent(component);
    setMenuOpen(true);
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
        <MenuItem as={Link} onClick={() => handleMenuItemClick("dashboard")}>
          Dashboard
        </MenuItem>
        <MenuItem as={Link} onClick={() => handleMenuItemClick("profile")}>
          Profile Account
        </MenuItem>
        <MenuItem as={Link} onClick={() => handleMenuItemClick("localPosts")}>
          Your Local Posts
        </MenuItem>
        <MenuItem as={Link} onClick={() => handleMenuItemClick("readingList")}>
          Reading List
        </MenuItem>
        <MenuItem as={Link} onClick={() => handleMenuItemClick("settings")}>
          Settings
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
  height: auto;
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

const MenuItem = styled.button`
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
