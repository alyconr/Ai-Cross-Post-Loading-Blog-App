import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import dompurify from 'dompurify';
import { AuthContext } from '../context/authContext';
import { useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import ClapsCommentsOnComments from './clapsCommentsOnCommnets';
import { BsFillTrashFill } from '@react-icons/all-files/bs/BsFillTrashFill';
import { FcEditImage } from '@react-icons/all-files/fc/FcEditImage';
import { FaCommentMedical } from 'react-icons/fa6';
import { MdOutlinePostAdd } from 'react-icons/md';
import { MdCancelPresentation } from 'react-icons/md';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const CommentOnComments = ({
  id,
  newCommentOnComment,
  setNewCommentOnComment,
}) => {
  const [commentList, setCommentList] = useState([]);
  const [setCont] = useState([]);
  const [postCommentTrigger, setPostCommentTrigger] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null); // Track the comment being edited
  const location = useLocation();
  const urlId = location.pathname.split('/')[2];
  const { currentUser } = useContext(AuthContext);

  const fetchCommentOnComments = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:9000/api/v1/commentsoncomment/${id}`,
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
  }, [id, setCont]);

  useEffect(() => {
    fetchCommentOnComments();
  }, [id, fetchCommentOnComments]);

  useEffect(() => {
    if (postCommentTrigger) {
      fetchCommentOnComments();
      setPostCommentTrigger(false);
    }
  }, [postCommentTrigger, fetchCommentOnComments]);

  const createMarkup = (html) => {
    return {
      __html: dompurify.sanitize(html),
    };
  };

  const handlePostComment = async () => {
    if (newCommentOnComment.trim() === '') {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9000/api/v1/commentsoncomment/${id}`,
        {
          onComment_id: id,
          postId: urlId,
          comment: newCommentOnComment,
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );
      const newCommentData = {
        comment: newCommentOnComment,
        fullname: response.data.fullname,
      };
      setCommentList([...commentList, newCommentData]);
      setNewCommentOnComment('');
      setPostCommentTrigger(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:9000/api/v1/commentsoncomment/${id}`,
        {
          withCredentials: true,
          credentials: 'include',
        }
      );
      setCommentList(commentList.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id) => {
    setEditCommentId(id);
    const commentToEdit = commentList.find((comment) => comment.id === id);
    setNewCommentOnComment(commentToEdit.comment);
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setNewCommentOnComment('');
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:9000/api/v1/commentsoncomment/${editCommentId}`,
        {
          comment: newCommentOnComment,
        },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );
      const updatedComments = commentList.map((comment) =>
        comment.id === editCommentId
          ? { ...comment, comment: newCommentOnComment }
          : comment
      );
      setCommentList(updatedComments);
      handleCancelEdit();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Action>
        {editCommentId ? (
          <div className="update-cancel">
            <button className="message" title="Update" onClick={handleUpdate}>
              <MdOutlinePostAdd size={35} color="#007bff" />
            </button>
            <button
              className="message"
              title="Cancel"
              onClick={handleCancelEdit}
            >
              <MdCancelPresentation size={35} color="FF3333" />
            </button>
          </div>
        ) : currentUser ? (
          <button
            title="Comment"
            className="message"
            onClick={handlePostComment}
          >
            {' '}
            <FaCommentMedical size={35} color="#007bff" />
          </button>
        ) : (
          <Link className="login" to="/login">
            Login to comment
          </Link>
        )}
      </Action>

      <Wrapper>
        {commentList.map((comment, index) => (
          <Comment key={index}>
            <div className="user">
              <img
                src={`../upload/${currentUser.user.image}`}
                className="user-Img"
                alt={currentUser.user.image}
              />
              <h2>{comment.fullname}</h2>
            </div>
            <div
              dangerouslySetInnerHTML={createMarkup(comment.comment)}
              style={{ maxWidth: '100%', overflow: 'hidden' }}
              className="comment"
            />
            <ActionComment>
              <PostedTime>
                <h6>{moment(comment.date).fromNow()}</h6>
              </PostedTime>

              <div className="d-flex gap-2 justify-content-end">
                <ClapsCommentsOnComments id={comment.id} />
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
              </div>
            </ActionComment>
          </Comment>
        ))}
      </Wrapper>
    </Container>
  );
};

CommentOnComments.propTypes = {
  id: PropTypes.number.isRequired,
  newCommentOnComment: PropTypes.func.isRequired,
  setNewCommentOnComment: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  setPost: PropTypes.func.isRequired,
};
export default CommentOnComments;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Action = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 6.5rem;

  .update-cancel {
    padding: 0.5rem 0;
  }

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
    width: 40px;
    height: 40px;
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
  flex-direction: column;
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
