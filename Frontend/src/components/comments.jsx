import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import dompurify from 'dompurify';
import { Link, useLocation } from 'react-router-dom';
import follower from '../assets/follower.png';
import { AuthContext } from '../context/authContext';
import { useContext } from 'react';
import { BsFillTrashFill } from '@react-icons/all-files/bs/BsFillTrashFill';
import { FcEditImage } from '@react-icons/all-files/fc/FcEditImage';
import { FaCommentMedical } from 'react-icons/fa6';
import { BiSolidCommentAdd } from 'react-icons/bi';
import { MdOutlinePostAdd } from 'react-icons/md';
import { MdCancelPresentation } from 'react-icons/md';
import ClapsOnComments from './clapsOnCommentsCounter';
import CommentOnComments from './commentOnComments';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const Comments = ({ post, setPost }) => {
  const [newComment, setNewComment] = useState('');
  const [newCommentOnComment, setNewCommentOnComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [postCommentTrigger, setPostCommentTrigger] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null); // Track the comment being edited
  const [cont, setCont] = useState([]);
  const location = useLocation();
  const urlId = location.pathname.split('/')[2];
  const { currentUser } = useContext(AuthContext);
  const [openTextEditor, setOpenTextEditor] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/comments/${urlId}`,
        {
          withCredentials: true,
          credentials: 'include',
        }
      );
      setCont(res.data);
      setCommentList(res.data.comments || []);
    } catch (err) {
      console.log(err);
    }
  }, [urlId, setCont]);

  useEffect(() => {
    fetchComments();
  }, [urlId, fetchComments]);

  useEffect(() => {
    if (postCommentTrigger) {
      fetchComments();
      setPostCommentTrigger(false);
    }
  }, [postCommentTrigger, fetchComments]);

  const handleSubmit = async () => {
    if (newComment.trim() === '') {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}/comments/${urlId}`,
        {
          postID: urlId,
          comment: newComment,
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );

      const newCommentData = {
        comment: newComment,
        fullname: response.data.fullname,
      };
      setCommentList([...commentList, newCommentData]);
      setNewComment('');
      setPostCommentTrigger(true);
    } catch (err) {
      console.log(err);
    }
  };

  const createMarkup = (html) => {
    return {
      __html: dompurify.sanitize(html),
    };
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URI}/comments/postId/${id}`, {
        withCredentials: true,
        credentials: 'include',
      });

      setCommentList(commentList.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id) => {
    setEditCommentId(id);
    const commentToEdit = commentList.find((comment) => comment.id === id);
    setNewComment(commentToEdit.comment);
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setNewComment('');
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URI}/comments/postId/${editCommentId}`,
        {
          comment: newComment,
        },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );

      const updatedComments = commentList.map((comment) =>
        comment.id === editCommentId
          ? { ...comment, comment: newComment }
          : comment
      );

      setCommentList(updatedComments);
      handleCancelEdit();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickonComment = () => {
    setOpenTextEditor(!openTextEditor);
  };

  return (
    <Container>
      <ReactQuill
        className="Box-editor"
        placeholder="Write your comment here..."
        value={newComment}
        onChange={setNewComment}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
            ['clean'],
            [{ color: [] }],
            [{ align: [] }],
            ['code-block'],
          ],
        }}
        formats={[
          'bold',
          'italic',
          'underline',
          'strike',
          'code-block',
          'link',
          'image',
          'color',
          'align',
        ]}
      />
      <Action>
        {editCommentId ? (
          <>
            <button title="Update" className="message" onClick={handleUpdate}>
              <MdOutlinePostAdd size={35} color="#007bff" />
            </button>
            <button
              title="Cancel"
              className="message"
              onClick={handleCancelEdit}
            >
              <MdCancelPresentation size={35} color="FF3333" />
            </button>
          </>
        ) : currentUser ? (
          <button className="message" title="Comment" onClick={handleSubmit}>
            <FaCommentMedical size={35} color="#007bff" />
          </button>
        ) : (
          <Link className="login" to="/login">
            Login to comment
          </Link>
        )}
      </Action>
      <Wrapper>
        {Array.isArray(commentList) &&
          commentList.map((comment, index) => (
            <Comment key={index}>
              <div className="user">
                {post.userImage ? (
                  <img
                    className="user-Img"
                    src={`../upload/${post.userImage}`}
                    alt={post.userImage}
                  />
                ) : (
                  <img className="user-Img" src={follower} alt="userImg" />
                )}
                <h2>{comment.fullname}</h2>
              </div>
              {editCommentId === comment.id ? (
                <div>
                  {' '}
                  <h6 className="ms-5 p-2 bg-primary text-white rounded">
                    Update your comment in the box editor above
                  </h6>
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={createMarkup(comment.comment)}
                  style={{ maxWidth: '100%', overflow: 'hidden' }}
                  className="comment"
                />
              )}
              <ActionComment>
                <PostedTime>
                  <h6>{moment(comment.date).fromNow()}</h6>
                </PostedTime>

                <div className="d-flex gap-2">
                  <ClapsOnComments id={comment.id} />
                  <button
                    title="Comment"
                    className="message"
                    onClick={handleClickonComment}
                  >
                    <BiSolidCommentAdd size={35} color={'#33FFCE'} />
                  </button>

                  {editCommentId !== comment.id && (
                    <div>
                      <button
                        title="Edit"
                        className="message"
                        onClick={() => handleEdit(comment.id)}
                      >
                        <FcEditImage size={30} />
                      </button>
                      <button
                        title="Delete"
                        className="message"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <BsFillTrashFill color={'#6A072D'} size={30} />
                      </button>
                    </div>
                  )}
                </div>
              </ActionComment>
              {openTextEditor && (
                <div>
                  <ReactQuill
                    className="Box-editor w-75"
                    placeholder="Write your comment here..."
                    value={newCommentOnComment}
                    onChange={setNewCommentOnComment}
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['link'],
                        ['clean'],
                        [{ color: [] }],
                        [{ align: [] }],
                        ['code-block'],
                      ],
                    }}
                    formats={[
                      'bold',
                      'italic',
                      'underline',
                      'strike',
                      'code-block',
                      'link',
                      'color',
                      'align',
                    ]}
                  />

                  <div className="d-flex justify-content-start ">
                    <CommentOnComments
                      id={comment.id}
                      newCommentOnComment={newCommentOnComment}
                      setNewCommentOnComment={setNewCommentOnComment}
                      post={post}
                      setPost={setPost}
                    />
                  </div>
                </div>
              )}
            </Comment>
          ))}
      </Wrapper>
    </Container>
  );
};

Comments.propTypes = {
  post: PropTypes.object.isRequired,
  setPost: PropTypes.func.isRequired,
};
export default Comments;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  .Box-editor {
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: hidden;
    resize: vertical;
    border: 3px solid #ccc;
    background: #f8f8f8;
    margin: 0 6.5rem;
    width: 100%;
  }
`;

const Action = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 10px -100px;
  gap: 10px;
  .message {
    border: none;
    background-color: transparent;
    cursor: pointer;
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

  .login {
    text-decoration: none;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 25%;
    text-align: center;
    padding: 1rem 0.2rem;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 75%;
  margin: 0 3.5rem;

  .comment {
    width: 100%;
    border-radius: 5px;
    border: 3px solid #ccc;
    background: #f8f8f8;
    margin: 0 3.5rem;
    padding: 1rem;
    overflow: hidden;
    resize: vertical;
  }

  h2 {
    font-size: 1rem;
    color: #333;
    margin: 0.5rem 0;
  }

  .user {
    display: flex;
    flex-direction: row;
  }

  .user-Img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`;

const PostedTime = styled.div`
  display: flex;

  h6 {
    color: #333;
    margin: 0.5rem 0;
  }
`;

const ActionComment = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin: 0.5rem 3.5rem;

  .message {
    border: none;
    background-color: transparent;
    cursor: pointer;
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
`;
