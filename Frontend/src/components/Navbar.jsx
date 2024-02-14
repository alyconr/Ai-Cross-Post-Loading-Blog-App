import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Dropdown from "react-bootstrap/Dropdown";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import logo from "../assets/logo.png";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [draftId, setDraftId] = useState("");
  const [draftPost, setDraftPost] = useState({});
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Load the draftId from localStorage on component mount
  useEffect(() => {
    const storedDraftId = localStorage.getItem("draftId");
    if (storedDraftId) {
      setDraftId(storedDraftId);
    }
  }, []); // Empty dependency array means this effect runs once on mount

  const fecthDraftPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/api/v1/draftposts`);
      if (res.data.posts.length > 0) {
        setDraftPost(res.data.posts[0]);
        const newDraftId = res.data.posts[0].id;
        setDraftId(newDraftId);

        //Save the new draftId to localStorage

        localStorage.setItem("draftId", newDraftId);
      } else {
        localStorage.removeItem("draftId");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <NavBar>
      <div className="container">
        <Link className="link" to="/">
          <Logo>
            <img src={logo} alt={logo} />
          </Logo>
        </Link>

        <Menu>
          <MenuItem className="text-decoration-none" to="/">
            Home
          </MenuItem>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Categories
            </Dropdown.Toggle>

            <Dropdown.Menu className="bg-light ">
              <Dropdown.Item>
                <MenuItem
                  className=" menu-item   text-decoration-none "
                  to="/?category=Web-Development"
                >
                  Web Development
                </MenuItem>
              </Dropdown.Item>
              <Dropdown.Item>
                <MenuItem
                  className="  menu-item text-decoration-none "
                  to="/?category=Cloud-Computing"
                >
                  Cloud Computing
                </MenuItem>
              </Dropdown.Item>
              <Dropdown.Item>
                <MenuItem
                  className="  menu-item text-decoration-none "
                  to="/?category=DevOps"
                >
                  DevOps
                </MenuItem>
              </Dropdown.Item>
              <Dropdown.Item>
                <MenuItem
                  className="  menu-item text-decoration-none "
                  to="/?category=Security"
                >
                  Security
                </MenuItem>
              </Dropdown.Item>
              <Dropdown.Item>
                <MenuItem
                  className="  menu-item text-decoration-none "
                  to="/?category=Linux"
                >
                  Linux
                </MenuItem>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {currentUser ? (
            <>
              <Dropdown>
                <Dropdown.Toggle
                  className="link-profile"
                  variant="success"
                  id="dropdown-basic"
                >
                  {currentUser?.user.username}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Profile to={`/profile/${currentUser?.user.username}`}>
                    <Dropdown.Item
                      className="menu-item text-decoration-none"
                      href="#/action-1"
                      onClick={closeMobileMenu}
                    >
                      <CgProfile size={20} /> Profile
                    </Dropdown.Item>
                  </Profile>
                  <Dropdown.Item
                    className="menu-item text-decoration-none"
                    onClick={handleLogout}
                  >
                    <RiLogoutCircleRLine /> Logout
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="menu-item text-decoration-none"
                    href="#/action-3"
                  >
                   <Link to={`/settings/${currentUser?.user.username}`} className="menu-item text-decoration-none"><IoSettingsOutline /> Settings</Link> 
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Write
                state={draftPost}
                onClick={fecthDraftPosts}
                to={`/write?draftId=${draftId}`}
              >
                Write <img className="write-img" src="../write.png" alt="" />
              </Write>
              <ImageProfile>
                <Button
                  onClick={handleShow}
                  className="bg-transparent border-0"
                >
                  <img
                    src={`../upload/${currentUser.user.image}`}
                    alt={currentUser.user.username}
                  />
                </Button>
              </ImageProfile>

              <Modal  show={showModal} onHide={handleClose}>
                <Modal.Header className=" border-0" closeButton></Modal.Header>
                <Modal.Body className="bg-dark">
                  <ProfileContainer>
                    <img
                      src={`../upload/${currentUser.user.image}`}
                      alt={currentUser.user.username}
                    />
                    <h1>{currentUser.user.fullname}</h1>
                    <h3>Email: {currentUser.user.email}</h3>
                  </ProfileContainer>
                </Modal.Body>
              </Modal>
            </>
          ) : (
            <Login to="/login">Login</Login>
          )}
        </Menu>
        <MobileMenuIcon onClick={toggleMobileMenu}>&#9776;</MobileMenuIcon>
        {isMobileMenuOpen && (
          <MobileMenu>
            <MenuItem to="/" onClick={closeMobileMenu}>
              Home
            </MenuItem>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Categories
              </Dropdown.Toggle>

              <Dropdown.Menu className="bg-light">
                <Dropdown.Item>
                  <MenuItem
                    className="menu-item text-decoration-none"
                    to="/?category=Web-Development"
                  >
                    Web Development
                  </MenuItem>
                </Dropdown.Item>
                <Dropdown.Item>
                  <MenuItem
                    className="menu-item text-decoration-none"
                    to="/?category=Cloud-Computing"
                  >
                    Cloud Computing
                  </MenuItem>
                </Dropdown.Item>
                <Dropdown.Item>
                  <MenuItem
                    className="menu-item text-decoration-none"
                    to="/?category=DevOps"
                  >
                    DevOps
                  </MenuItem>
                </Dropdown.Item>
                <Dropdown.Item>
                  <MenuItem
                    className="menu-item text-decoration-none"
                    to="/?category=Security"
                  >
                    Security
                  </MenuItem>
                </Dropdown.Item>
                <Dropdown.Item>
                  <MenuItem
                    className="menu-item text-decoration-none"
                    to="/?category=Linux"
                  >
                    Linux
                  </MenuItem>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {currentUser ? (
              <>
                <Dropdown>
                  <Dropdown.Toggle
                    className="link-profile"
                    variant="success"
                    id="dropdown-basic"
                  >
                    {currentUser?.user.username}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Profile to={`/profile/${currentUser?.user.username}`}>
                      <Dropdown.Item
                        href="#/action-1"
                        onClick={closeMobileMenu}
                        className="menu-item text-decoration-none"
                      >
                        <CgProfile size={20} /> Profile
                      </Dropdown.Item>
                    </Profile>

                    <Dropdown.Item
                      className="menu-item text-decoration-none"
                      onClick={logout}
                    >
                      <RiLogoutCircleRLine /> Logout
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="menu-item text-decoration-none"
                      href="#/action-3"
                    >
                      <IoSettingsOutline /> Settings
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Span>
                  <Write to="/write" onClick={closeMobileMenu}>
                    Write{" "}
                    <img className="write-img" src="../write.png" alt="" />
                  </Write>
                </Span>
                <ImageProfile>
                  <Button
                    onClick={handleShow}
                    className="bg-transparent border-0"
                  >
                    <img
                      src={`../upload/${currentUser.user.image}`}
                      alt={currentUser.user.username}
                    />
                  </Button>
                </ImageProfile>

                <Modal show={showModal} onHide={handleClose}>
                  <Modal.Header className="border-0" closeButton></Modal.Header>
                  <Modal.Body>
                    <ProfileContainer>
                      <img
                        src={`../upload/${currentUser.user.image}`}
                        alt={currentUser.user.username}
                      />
                      <h1>{currentUser.user.fullname}</h1>
                      <h3>Email: {currentUser.user.email}</h3>
                    </ProfileContainer>
                  </Modal.Body>
                </Modal>
              </>
            ) : (
              <Span>
                <Link to="/login">Login</Link>
              </Span>
            )}
          </MobileMenu>
        )}
      </div>
    </NavBar>
  );
};

export default Navbar;

const NavBar = styled.div`
  width: 100%;
  height: 70px;
  background-color: #342e2e;
  position: sticky;
  top: 0;
  z-index: 999;
  .container {
    padding: 0px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  .link-profile {
    background: linear-gradient(
      90deg,
      rgba(131, 58, 180, 1) 0%,
      rgba(253, 29, 29, 1) 50%,
      rgba(252, 176, 69, 1) 100%
    );
  }
`;

const Logo = styled.div`
  display: flex;
  flex: 1;
  align-items: center;

  img {
    height: 200px;
    width: 250px;
    cursor: pointer;
  }
`;

const Menu = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  @media (max-width: 768px) {
    display: none; /* Hide the regular menu on small screens */
  }

  @media (max-width: 820px) {
    display: none; /* Hide the regular menu on small screens */
  }

  .menu-item {
    font-size: 18px;
    cursor: pointer;
    color: black;
    border-radius: 25px;
  }

  .menu-item:hover {
    text-decoration: underline;
    background-color: #342e2e;
    padding: 10px;
    color: white;
  }
`;

const MobileMenuIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
  color: white;
  display: none; /* Hide the mobile menu icon on larger screens */

  @media (max-width: 768px) {
    display: block; /* Show the mobile menu icon on small screens */
  }

  @media (max-width: 820px) {
    display: block; /* Show the mobile menu icon on small screens */
  }

  @media (max-width: 820px) {
    display: block; /* Show the mobile menu icon on small screens */
  }
`;

const MobileMenu = styled.div`
  display: none; /* Hide the mobile menu on larger screens */

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background-color: #342e2e;
    gap: 10px;
  }

  @media (max-width: 820px) {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background-color: #342e2e;
    gap: 10px;
  }

  .menu-item {
    font-size: 18px;
    cursor: pointer;
    color: black;
    border-radius: 25px;
  }

  .menu-item:hover {
    text-decoration: underline;
    background-color: #342e2e;
    padding: 10px;
    color: white;
  }
`;

const MenuItem = styled(Link)`
  font-size: 20px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-weight: 500;
  text-align: center;

  &:hover {
    transform: scale(1.1);
    transition: all 0.3s ease;
    text-decoration: underline;
    cursor: pointer;
    color: #12c4c1;
  }

  @media (max-width: 365px) {
    &:hover {
      transform: scale(1.1);
      transition: all 0.3s ease;
      text-decoration: underline;
      cursor: pointer;
      color: #12c4c1;
    }

    @media (max-width: 768px) {
      &:hover {
        transform: scale(1.1);
        transition: all 0.3s ease;
        text-decoration: underline;
        cursor: pointer;
        color: #12c4c1;
      }
    }

    @media (max-width: 820px) {
      &:hover {
        transform: scale(1.1);
        transition: all 0.3s ease;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
`;

const Span = styled.div`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-weight: 500;
  margin: 10px auto;
  padding: 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
  width: 30%;
  text-align: center;

  &:hover {
    transform: scale(1.1);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .link {
    text-decoration: none;
    color: white;
  }
`;

const Write = styled(Link)`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  background: linear-gradient(
    0deg,
    rgba(34, 193, 195, 1) 0%,
    rgba(165, 108, 108, 1) 100%
  );
  padding: 10px;
  border-radius: 50px;
  transition: all 0.3s ease;
  width: 10%;
  text-align: center;

  .write-img {
    width: 25px;
    height: 25px;
  }
`;

const Profile = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  color: white;
  border-radius: 50px;
  transition: all 0.3s ease;
  width: 10%;
`;

const ImageProfile = styled.div`
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    transition: all 0.3s ease;
  }
`;
const Login = styled(Link)`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  font-weight: bolder;
  color: black;
  background: linear-gradient(
    90deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(225, 253, 29, 1) 50%,
    rgba(252, 176, 69, 1) 100%
  );
  padding: 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
  width: 15%;
  text-align: center;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 5rem;
  border: 1px solid #ebe3d5;
  margin: 2rem auto;
  border-radius: 10px;
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
  background-image: linear-gradient(
    to right top,
    #c9e0d7,
    #b4dbe1,
    #b1d2ee,
    #c7c3ec,
    #e6b2d4
  );

  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-top: 10px;
    margin-bottom: 5px;
    color: #1a0a06;
    text-align: center;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: bolder;
    color: #1a0a06;
    text-align: center;
  }
`;
