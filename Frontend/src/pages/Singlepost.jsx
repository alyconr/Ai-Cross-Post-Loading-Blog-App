import styled from "styled-components";
import { BsFillTrashFill } from "@react-icons/all-files/bs/BsFillTrashFill";
import { FcEditImage } from "@react-icons/all-files/fc/FcEditImage";
import { FaUsers } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuLeft from "../components/Menuside";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import follower from "../assets/follower.png";
import dompurify from "dompurify";
import { toast } from "react-toastify";
import ApplauseButton from "../components/ClapCounter";
import Comments from "../components/comments";
import { FaCommentDots } from "react-icons/fa";
import { Offcanvas } from "react-bootstrap";
import { MdBookmarkAdd } from "react-icons/md";

import Share from "../components/share";
const Singlepost = () => {
  const [post, setPost] = useState({});
  const [userImage, setUserImage] = useState("");
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const [show, setShow] = useState(false);
  const [showBookmark, setShowBookmark] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const postId = location.pathname.split("/")[2];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const currentUserUsername = currentUser?.user?.username;

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/v1/posts/${postId}`
        );
        setPost(res.data.post);
        console.log(res.data.post);

        const userRes = await axios.get(
          `http://localhost:9000/api/v1/user/${res.data.post.username}`,
          {
            withCredentials: true,
            credentials: "include",
          }
        );
        setUserImage(userRes.data[0]?.userImage || "");
      } catch (err) {
        console.log(err);
      }
    };

    getPost();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:9000/api/v1/posts/${postId}`, {
        withCredentials: true,
      });
      navigate("/");
      toast.info("Post deleted successfully", {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const createMarkup = (html) => {
    return {
      __html: dompurify.sanitize(html), // this will sanitize the html code to prevent XSS attacks
    };
  };

  const handleBookmark = async () => {
    try {
      await axios.post(
        "http://localhost:9000/api/v1/bookmarks",
        {
          usersId: currentUser?.user?.id,
          postsId: postId,
        },
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      setShowBookmark(true);
      toast.info("Post bookmarked successfully", {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getBookmarks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/v1/bookmarks/${currentUser?.user?.id}`
        );
        setBookmarks(res.data.bookmarks);
        console.log(res.data.bookmarks);

        // Check if any bookmark has the same postId
        const isBookmarked = res.data.bookmarks.some(
          (bookmark) => bookmark.id === parseInt(postId)
        );

        setShowBookmark(isBookmarked);
      } catch (err) {
        console.log(err);
      }
    };
    getBookmarks();
  }, [postId]);

  const deleteBookmark = async () => {
    try {
      await axios.delete(
        `http://localhost:9000/api/v1/bookmarks/${currentUser?.user?.id}`,
        {
          data: {
            usersId: currentUser?.user?.id,
            postsId: postId,
          },
        }
      );
      setShowBookmark(false);
      toast.info("Post unbookmarked successfully", {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Wrapper>
      <Post>
        <img
          className="postImg"
          src={`http://localhost:9000/uploads/${post.image}`}
          alt=""
        />
        <div className="user">
          {userImage && (
            <img
              className="userImg"
              src={`http://localhost:9000/uploads/${post.userImage}`}
              alt={userImage}
            />
          )}
          <div className="info">
            <PostLink to={`/profile/${post.username}`}>
              {" "}
              <span>{post.fullname}</span>
            </PostLink>

            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUserUsername && currentUserUsername === post.username && (
            <div className="Actions">
              <Link to={`/write?edit=${postId}`} state={post}>
                <button title="Edit" className="message">
                  <FcEditImage size={30} />
                </button>
              </Link>
              <Link to={`/singlepost/${postId}/title=${encodeURIComponent(post.title.replace(/ /g, "-"))}`}>
                <button title="Delete" className="message">
                  <BsFillTrashFill
                    onClick={handleDelete}
                    color={"#6A072D"}
                    size={30}
                  />
                </button>
              </Link>
            </div>
          )}
          <Claps>
            <ApplauseButton className="applause" />
          </Claps>
          <button
            onClick={handleShow}
            title=" View Comments"
            className="message"
          >
            {" "}
            <FaCommentDots className="comment" size={30} />
          </button>
          {post.fullname !== currentUser?.user?.fullname && !showBookmark ? (
            <button
              onClick={handleBookmark}
              className="message "
              title="Bookmark"
            >
              <MdBookmarkAdd className="bookmark" size={35} />
            </button>
          ) : post.fullname !== currentUser?.user?.fullname && showBookmark ? (
            <button
              onClick={deleteBookmark}
              className="message "
              title="Bookmark"
            >
              {" "}
              <MdBookmarkAdd className="bookmark" size={35} color="#0D0D0E" />
            </button>
          ) : null}

      
          <Share post={post} />
        </div>
        <h1>{post.title}</h1>
        <h3>{post.description}</h3>
        <div
          className="paragraph"
          dangerouslySetInnerHTML={createMarkup(post.content)}
          style={{ maxWidth: "100%", overflow: "hidden" }}
        />
        <FooterAction>
          <ApplauseButton />
          <button
            onClick={handleShow}
            title=" View Comments"
            className="message"
          >
            {" "}
            <FaCommentDots className="comment" size={30} />
          </button>
          {post.fullname !== currentUser?.user?.fullname && !showBookmark ? (
            <button
              onClick={handleBookmark}
              className="message "
              title="Bookmark"
            >
              <MdBookmarkAdd className="bookmark" size={35} />
            </button>
          ) : post.fullname !== currentUser?.user?.fullname && showBookmark ? (
            <button
              onClick={deleteBookmark}
              className="message "
              title="Bookmark"
            >
              {" "}
              <MdBookmarkAdd className="bookmark" size={35} color="#0D0D0E" />
            </button>
          ) : null }
       
        
        </FooterAction>

        <Offcanvas show={show} onHide={handleClose} className="w-50 p-1 ">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="bg-dark text-light p-3 rounded ">
              User Comments <FaUsers size={30} />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ContainerComments>
              {currentUser ? (
                <div className="user-info">
                  {currentUser.user.image ? (
                    <img
                      className="user-Img"
                      src={`../upload/${currentUser.user.image}`}
                      alt={currentUser.user.image}
                    />
                  ) : (
                    <img
                      className="user-Img"
                      src={follower}
                      alt={currentUser.user.fullname}
                    />
                  )}
                  <h4 className="text-dark ">
                    {currentUser.user.fullname}{" "}
                    <p className="text-danger">What are your thoughts?</p>{" "}
                  </h4>
                </div>
              ) : (
                <h3 className="text-center text-danger pb-3">
                  What are your thoughts?
                </h3>
              )}

              <Comments post={ post } setPost={ setPost } />
              test
            </ContainerComments>
          </Offcanvas.Body>
        </Offcanvas>
      </Post>
      <MenuSide>
        <MenuLeft category={post.category} />
      </MenuSide>
    </Wrapper>
  );
};

export default Singlepost;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const Post = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 0 20px;

  .message {
    border: none;
    background-color: transparent;
    cursor: pointer;
    color: #884dff;
    margin-left: 5px;
    position: relative;
  }

  .message[title]:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 0.5rem;
  }

  .postImg {
    width: 100%;
    border-radius: 5px;
    margin: 30px 0;
  }

  .user {
    display: flex;
    align-items: center;
    margin: -10px 0;

    .userImg {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      margin-top: -15px;
      margin-right: 10px;
    }
  }

  .info {
    display: flex;
    flex-direction: column;

    span {
      font-weight: bold;
    }

    p {
      font-size: 14px;
      color: #555;
    }
  }

  .Actions {
    padding: 10px;
    display: flex;
    gap: 10px;
  }

  h1 {
    margin: 20px 0;
    font-size: 30px;
  }

  h3 {
    margin: 20px 0;
    font-size: 20px;
    color: #555;
  }

  @media screen and (max-width: 768px) {
    width: 80%;
    margin: 0 auto;
  }

  .comment {
    margin-left: 10px;
    cursor: pointer;
    color: #884dff;
  }

  .bookmark {
    margin-left: 5px;
    cursor: pointer;
    color: #01df74;
  }

  .share {
    margin-left: 5px;
    cursor: pointer;
    color: #884dff;
    
  }
`;

const PostLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
`;
const MenuSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Claps = styled.div`
  display: flex;
`;

const ContainerComments = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 40px 0 0 0px;

  .user-Img {
    width: 75px;
    height: 75px;
    margin-right: 15px;
    border-radius: 50%;
  }
  .user-info {
    display: flex;
  }
`;

const FooterAction = styled.div`
  display: flex;
  flex-direction: row;
`;
