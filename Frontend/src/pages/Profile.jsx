import styled from 'styled-components';
import { FaRegBuilding } from 'react-icons/fa';
import { MdOutlinePlace } from 'react-icons/md';
import { CiLinkedin } from 'react-icons/ci';
import { MdOutlinePostAdd } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa6';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { toast } from 'react-toastify';
import useFetch from '../utils/useFetch';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { Modal, Button } from 'react-bootstrap';
import { SlUserFollowing } from 'react-icons/sl';
import { SlUserUnfollow } from 'react-icons/sl';
import { MdOutlineGroups2 } from 'react-icons/md';
import followerUser from '../assets/follower.png';
import { BsBookmarkHeartFill } from 'react-icons/bs';

// Import Modal and Button from react-bootstrap

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('');
  const [username] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState('');

  const [company, setCompany] = useState('');
  const [place, setPlace] = useState('');
  const [social1, setSocial1] = useState('');
  const [social2, setSocial2] = useState('');
  const [errors, setErrors] = useState({ password: '' });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [follow, setFollow] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [showModalFollower, setShowModalFollower] = useState(false);
  const [showModalFollowing, setShowModalFollowing] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();
  const userName = location.pathname.split('/')[2];

  const { data: posts } = useFetch(
    `${import.meta.env.VITE_API_URI}/user/posts/${userName}`
  );

  useEffect(() => {
    if (!isEditMode) {
      const getUser = async () => {
        try {
          const endpoint =
            userName !== currentUser?.user.username
              ? `${import.meta.env.VITE_API_URI}/user/${userName}`
              : `${import.meta.env.VITE_API_URI}/user/${
                  currentUser?.user.username
                }`;

          const res = await axios.get(endpoint, {
            withCredentials: true,
            credentials: 'include',
          });
          setUser(res.data[0]);
          setName(res.data[0]?.fullname || '');
          setPassword(res.data[0]?.password || '');
          setBio(res.data[0]?.bio || '');
          setFile(res.data[0].image || null);
          setCompany(res.data[0]?.company || '');
          setPlace(res.data[0]?.location || '');
          setSocial1(res.data[0]?.social1 || '');
          setSocial2(res.data[0]?.social2 || '');
        } catch (error) {
          console.error(error);
        }
      };
      getUser();
    }
  }, [isEditMode, userName, currentUser]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCloseErrorModal = () => setShowErrorModal(false);

  const handleSave = async () => {
    let imgUrl = '';
    try {
      const formData = new FormData();

      if (file) {
        formData.append('file', file);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URI}/upload`,
          formData
        );
        imgUrl = response.data;
        formData.append('image', imgUrl); // Append the image URL to the formData
      }

      await axios.put(
        `${import.meta.env.VITE_API_URI}/user/${currentUser?.user.username}`,
        {
          fullname: name,
          username,
          password,
          bio,
          image: file ? imgUrl : user.userImage,
          company,
          location: place,
          social1,
          social2,
        },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );

      setIsEditMode(false);
      navigate(`/profile/${currentUser?.user.username}`);
      toast.success('Profile updated successfully', {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 400) {
        setErrors({ password: error.response.data.result });
        setShowErrorModal(true);
      }
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleFollow = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URI}/followers/${currentUser?.user.id}`,
        {
          following_id: user.id,
          followers_count: 1,
        },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );
      setFollow(!follow);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/followers/${user.id}`
        );

        setFollowers(res.data);
        console.log(res.data);
        const values = res.data;

        const filter = values.filter(
          (value) => value.id === currentUser?.user.id
        );

        if (filter.length > 0) {
          if (filter[0].id === currentUser?.user.id) {
            setFollow(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowers();
  }, [currentUser?.user.id, user.id]);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/followings/${user.id}`
        );

        setFollowing(res.data);
        console.log(res.data);

        const values = res.data;

        const filter = values.filter(
          (value) => value.id === currentUser?.user.id
        );

        if (filter.length > 0) {
          if (filter[0].id === currentUser?.user.id) {
            setFollowing(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowings();
  }, [currentUser?.user.id, user.id]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/bookmarks/${currentUser?.user.id}`
        );

        setBookmarks(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookmarks();
  }, [currentUser?.user.id]);

  const handleUnFollow = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URI}/followers/unfollow/${
          currentUser?.user.id
        }`,
        {
          data: {
            following_id: user.id,
          },
          withCredentials: true,
          credentials: 'include',
        }
      );
      setFollow(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <Container>
        {!isEditMode ? (
          <ProfileContainer>
            {user.userImage && (
              <img
                className="userImg"
                src={`../upload/${user.userImage}`}
                alt={user.image}
              />
            )}
            <h1>{user.fullname}</h1>
            <h3>{user.username}</h3>
            <p>{user.bio}</p>
            {currentUser && currentUser.user.username === user.username && (
              <button onClick={handleEdit}>Edit Profile</button>
            )}

            <hr />

            <UserInfo>
              <div>
                <MdOutlinePostAdd size={30} color="#6A072D" />{' '}
                <p className="m-0 d-inline ps-2  fw-bold fs-5">
                  {posts?.length} Posts{' '}
                </p>
                <Link to={`/profile/${user.username}/posts`}>
                  <FaMagnifyingGlass color="#2E2E3B" />
                </Link>
              </div>
              <div>
                <BsBookmarkHeartFill size={30} color="#6A072D" />
                <p className="m-0 d-inline ps-2  fw-bold fs-5">
                  {bookmarks?.length > 0 ? bookmarks?.length : 0} Bookmarks{' '}
                </p>
                <Link to={`/profile/${user.username}/bookmarks`}>
                  <FaMagnifyingGlass color="#2E2E3B" />
                </Link>
              </div>
            </UserInfo>

            <UserInfo>
              <div>
                <MdOutlineGroups2 size={30} color="#6A072D" />{' '}
                <p className="m-0 d-inline ps-2  fw-bold fs-5">
                  {followers?.length > 0 ? followers?.length : 0} Followers
                </p>
                <Button
                  onClick={() => setShowModalFollower(true)}
                  className="btn-followers border-0 bg-transparent"
                >
                  <FaMagnifyingGlass size={18} color="#333" />
                </Button>
              </div>
              <div>
                <SlUserFollowing size={25} color="#6A072D" />{' '}
                <p className="m-0 d-inline ps-2  fw-bold fs-5">
                  {following?.length > 0 ? following?.length : 0} Followings
                </p>
                <Button
                  onClick={() => setShowModalFollowing(true)}
                  className="btn-followers border-0 bg-transparent "
                >
                  <FaMagnifyingGlass size={18} color="#333" />
                </Button>
              </div>
            </UserInfo>

            <hr />

            <div>
              {user.company && (
                <h3>
                  <FaRegBuilding /> {user.company}{' '}
                </h3>
              )}
              {user.location && (
                <h3>
                  <MdOutlinePlace /> {user.location}{' '}
                </h3>
              )}
              {user.social1 && (
                <h3>
                  <FaGithub />{' '}
                  <Link className="link" to={user.social1}>
                    {user.social1}
                  </Link>
                </h3>
              )}
              {user.social2 && (
                <h3>
                  <CiLinkedin />{' '}
                  <Link className="link" to={user.social1}>
                    {user.social2}
                  </Link>
                </h3>
              )}
            </div>
            <div>
              {currentUser &&
              currentUser.user.username !== user.username &&
              !follow ? (
                <Button onClick={handleFollow}>
                  Follow
                  <SlUserUnfollow />
                </Button>
              ) : currentUser && currentUser.user.username !== user.username ? (
                <Button onClick={handleUnFollow}>
                  unFollow <SlUserFollowing />
                </Button>
              ) : null}
            </div>
            <Modal
              size="sm"
              show={showModalFollowing}
              onHide={() => setShowModalFollowing(false)}
              aria-labelledby="example-modal-sizes-title-sm "
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title
                  className="text-dark bold fw-bold "
                  id="example-modal-sizes-title-sm"
                >
                  Followings
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {Array.isArray(following) &&
                  following.map((follow, index) => (
                    <div
                      className="d-flex align-items-center gap-3 mb-2"
                      key={`${follow.id}_${index}`}
                    >
                      {follow.userImage ? (
                        <Image>
                          <img
                            className="userImg-follower"
                            src={`../upload/${follow.userImage}`}
                            alt={user.fullname}
                          />
                        </Image>
                      ) : (
                        <img src={followerUser} alt={user.username} />
                      )}
                      <Link
                        onClick={() => setShowModalFollowing(false)}
                        className="text-decoration-none text-dark"
                        to={`/profile/${follow.username}`}
                      >
                        {follow.fullname}
                      </Link>
                    </div>
                  ))}
              </Modal.Body>
            </Modal>
            <Modal
              size="sm"
              show={showModalFollower}
              onHide={() => setShowModalFollower(false)}
              aria-labelledby="example-modal-sizes-title-sm "
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title
                  className="text-dark bold fw-bold "
                  id="example-modal-sizes-title-sm"
                >
                  Followers
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {Array.isArray(followers) &&
                  followers.map((follower, index) => (
                    <div
                      className="d-flex align-items-center gap-3 mb-2"
                      key={`${follower.id}_${index}`}
                    >
                      {follower.userImage ? (
                        <Image>
                          <img
                            className="userImg-follower"
                            src={`../upload/${follower.userImage}`}
                            alt={user.fullname}
                          />
                        </Image>
                      ) : (
                        <img src={followerUser} alt={user.username} />
                      )}
                      <Link
                        onClick={() => setShowModalFollower(false)}
                        className="text-decoration-none text-dark"
                        to={`/profile/${follower.username}`}
                      >
                        {follower.fullname}
                      </Link>
                    </div>
                  ))}
              </Modal.Body>
            </Modal>
          </ProfileContainer>
        ) : (
          <EditProfile>
            <form>
              {user.userImage && (
                <img
                  className="userImg"
                  src={`../upload/${user.userImage}`}
                  alt={user.image}
                />
              )}
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="email">Email</label>
              <h4>{user.email}</h4>
              <label htmlFor="username">Username</label>
              <h4>{user.username}</h4>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label htmlFor="bio">Bio</label>
              <textarea
                placeholder="Add a Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
              <input
                style={{ display: 'none' }}
                type="file"
                name=""
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label className="input-file" htmlFor="file">
                Upload Profile Image
              </label>
              <h6>{(file && `${file?.name}`) || `${user?.userImage}`} </h6>
              <label>Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <label>Location</label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
              <h4>Social Accounts</h4>

              <div className="social">
                <FaGithub />
                <input
                  type="link"
                  value={social1}
                  onChange={(e) => setSocial1(e.target.value)}
                />
                <CiLinkedin />
                <input
                  type="link"
                  value={social2}
                  onChange={(e) => setSocial2(e.target.value)}
                />
              </div>
            </form>
            <div className="Actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>cancel</button>
            </div>
          </EditProfile>
        )}

        <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
          <Modal.Header closeButton>
            <Modal.Title>Error Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>{errors.password}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseErrorModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Wrapper>
  );
};

export default Profile;

const Wrapper = styled.div`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;
const ProfileContainer = styled.div`
  padding: 5rem 1rem;
  border: 1px solid #ebe3d5;
  margin: 2rem 2rem;
  border-radius: 10px;
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);

  img {
    width: 150px;
    height: 150px;
    display: block;
    margin: 0 auto;
  }

  h1 {
    color: #333;
    text-align: center;
  }

  h3 {
    color: #333;
    font-size: 1.5rem;
  }
  button:not(.btn-followers) {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
    color: #fff;
    background: linear-gradient(
      90deg,
      rgba(0, 6, 36, 1) 0%,
      rgba(9, 21, 121, 1) 35%,
      rgba(0, 212, 255, 1) 100%
    );
    border: none;
    cursor: pointer;
    margin: 0.5rem 0;
    width: 100%;
    text-align: center;
    display: block;
  }

  button:hover:not(.btn-followers) {
    background: radial-gradient(
      circle,
      rgba(0, 6, 36, 1) 0%,
      rgba(9, 21, 121, 1) 35%,
      rgba(0, 212, 255, 1) 100%
    );
  }

  .link {
    text-decoration: none;
    color: #7e727c;
    cursor: pointer;
  }

  .userImg {
    width: 150px;
    height: 150px;
    display: block;
    margin: 0 auto;
    border-radius: 50%;
    object-fit: cover;
  }

  @media (min-width: 368px) {
    margin: 2rem auto;
  }
`;
const EditProfile = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 5rem;
  width: 100%;
  border: 1px solid #ebe3d5;
  margin: 2rem auto;
  border-radius: 10px;
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);

  input {
    padding: 0 2.5rem;
    border: 1px solid #ebe3d5;
    border-radius: 50px;
  }

  textarea {
    border: 1px solid #ebe3d5;
    border-radius: 10px;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0;
    width: 100%;
    height: 100px;
    resize: none;
  }

  .input-file {
    width: 75%;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    background: radial-gradient(
      circle,
      rgba(238, 174, 202, 1) 0%,
      rgba(148, 187, 233, 1) 100%
    );
    color: #534b52;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  .input-file:hover {
    background: radial-gradient(
      circle,
      rgba(148, 187, 233, 1) 0%,
      rgba(238, 174, 202, 1) 100%
    );
  }

  h4 {
    color: #62666b;
  }

  label {
    color: #858d92;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 2rem 0;
  }

  .error-message {
    color: blue;
  }

  .social {
    display: flex;
    flex-direction: column;
    margin-bottom: -10px;
  }
  button:not(.btn-followers) {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
    color: #fff;
    background: linear-gradient(
      90deg,
      rgba(0, 6, 36, 1) 0%,
      rgba(9, 21, 121, 1) 35%,
      rgba(0, 212, 255, 1) 100%
    );
    border: none;
    cursor: pointer;
    margin: 0.5rem 0;
    width: 100%;
    text-align: center;
    display: block;
  }

  button:not(.btn-followers):hover {
    background: radial-gradient(
      circle,
      rgba(0, 6, 36, 1) 0%,
      rgba(9, 21, 121, 1) 35%,
      rgba(0, 212, 255, 1) 100%
    );
  }

  .Actions {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .userImg {
    width: 150px;
    height: 150px;
    display: block;
    margin: 0 auto;
    border-radius: 50%;
  }
`;

const Image = styled.div`
  .userImg-follower {
    width: 40px;
    height: 40px;
    display: block;
    margin: 0 auto;
    border-radius: 50%;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  @media (max-width: 432px) {
    flex-direction: column;
  }
`;
