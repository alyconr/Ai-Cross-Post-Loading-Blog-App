import styled from "styled-components";

const Sidebar = ({ menuOpen, setMenuOpen }) => {
  return (
    <SidebarContainer menuOpen={menuOpen}>
      <ToggleButton onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "Close" : "Open"}
      </ToggleButton>
      <MenuItems menuOpen={menuOpen}>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Reading List</MenuItem>
      </MenuItems>
    </SidebarContainer>
  );
};

export default Sidebar;
const SidebarContainer = styled.div`
  width: ${(props) => (props.menuOpen ? "300px" : "80px")};
  transition: width 0.3s;
  background-color: #343a40;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ToggleButton = styled.button`
  background: white;
  border: none;
  color: black;
  padding: 10px;
  cursor: pointer;
`;

const MenuItems = styled.div`
  display: ${(props) => (props.menuOpen ? "block" : "none")};
  padding: 10px;
`;

const MenuItem = styled.div`
  padding: 10px 0;
  cursor: pointer;
  &:hover {
    background-color: #495057;
    border-radius: 5px;
    padding: 10px;
  }
`;
