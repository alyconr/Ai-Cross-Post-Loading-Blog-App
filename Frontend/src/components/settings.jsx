import styled from 'styled-components';
import { CiLinkedin } from 'react-icons/ci';
import { FaGithub } from 'react-icons/fa6';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { toast } from 'react-toastify';
import useFetch from '../utils/useFetch';

const Settings = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [username] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState('');
  const [company, setCompany] = useState('');
  const [place, setPlace] = useState('');
  const [social1, setSocial1] = useState('');
  const [social2, setSocial2] = useState('');
  const [setErrors] = useState({ password: '' });
  const [setShowErrorModal] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.pathname.split('/')[2];

  useFetch(`${import.meta.env.VITE_API_URI}/user/posts/${userName}`);

  useEffect(() => {
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
  }, [userName, currentUser]);

  const handleSave = async () => {
    let imgUrl = '';
    try {
      const formData = new FormData();

      if (file) {
        formData.append('file', file);

        const response = await axios.post(
          '${import.meta.env.VITE_API_URI}/upload',
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
    navigate(`/`);
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URI}/user/${currentUser?.user.username}`,
        {
          withCredentials: true,
          credentials: 'include',
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
        <button onClick={handleDeleteAccount} className="danger">
          Delete Account
        </button>
      </div>
    </EditProfile>
  );
};

export default Settings;
const EditProfile = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 5rem;
  width: 70vw;
  border: 1px solid #ebe3d5;
  margin: 2rem auto;
  border-radius: 10px;
  -webkit-box-shadow: 2px 1px 43px 23px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 2px 1px 43px 23px rgba(0, 0, 0, 0.75);
  box-shadow: 2px 1px 43px 23px rgba(0, 0, 0, 0.75);

  input {
    padding: 0 2.5rem;
    border: 2px solid #ebe3d5;
    border-radius: 50px;
    height: 2.5rem;
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
    color: black;
    font-size: 1.5rem;
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
  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
    color: #fff;
    background: hsla(148, 100%, 47%, 1);

    background: linear-gradient(
      90deg,
      hsla(148, 100%, 47%, 1) 0%,
      hsla(211, 90%, 47%, 1) 100%
    );

    background: -moz-linear-gradient(
      90deg,
      hsla(148, 100%, 47%, 1) 0%,
      hsla(211, 90%, 47%, 1) 100%
    );

    background: -webkit-linear-gradient(
      90deg,
      hsla(148, 100%, 47%, 1) 0%,
      hsla(211, 90%, 47%, 1) 100%
    );

    filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#00EE6E", endColorstr="#0C75E6", GradientType=1 );
    border: none;
    cursor: pointer;
    margin: 0.5rem 0;
    width: 100%;
    text-align: center;
    display: block;
  }

  button[class='danger'] {
    background: linear-gradient(
      90deg,
      rgba(0, 6, 36, 1) 0%,
      rgba(255, 0, 0, 1) 35%
    );
  }

  button:hover {
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
