import { useState, useEffect } from 'react';
import HandsOutline from '../assets/hands-outline.png';
import Hands from '../assets/hands.png';
import users from '../assets/users.png';
import SparkSvg from './SparkSvg';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FaHandsClapping } from 'react-icons/fa6';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import PropTypes from 'prop-types';

const APPLAUSE_MAX = 500;


const ClapsOnComments = ({ id }) => {
  const [showSpark, setShowSpark] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [localClaps] = useState(0);
  const [totalClaps, setTotalClaps] = useState(0);
  const [lgShow, setLgShow] = useState(false);
  const [usersClaps, setUserClaps] = useState({});
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchClaps = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/v1/clapsoncomments/${id}`
        );

        if (response.data && response.data.total_claps) {
          setTotalClaps(response.data.total_claps);
        }
      } catch (error) {
        console.error('Error fetching total claps:', error);
      }
    };
    fetchClaps();
  }, [id]);

  const sparkAnimation = useSpring({
    opacity: showSpark ? 1 : 0,
    transform: showSpark ? 'scale(1)' : 'scale(0)',
    onRest: () => setShowSpark(false), // Hide the spark after the animation is complete
  });

  const bubbleAnimation = useSpring({
    opacity: showBubble ? 1 : 0,
    transform: showBubble ? 'translateY(0)' : 'translateY(-50px)',
  });

  const handleClick = async () => {
    try {
      // Send a POST request to update applause_count in the database
      await axios.post(
        `http://localhost:9000/api/v1/clapsoncomments/${id}`,
        {
          applauseComment_count: localClaps + 1, // Incremented local claps value
          comment_id: id, // Include the post_id in the request body
        },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );

      // Fetch updated total claps
      const response = await axios.get(
        `http://localhost:9000/api/v1/clapsoncomments/${id}`
      );

      if (response.data && response.data.total_claps) {
        setTotalClaps(response.data.total_claps);
        console.log(response.data.total_claps);
      }

      setShowSpark(true);
      setShowBubble(true);
    } catch (error) {
      console.error('Error posting claps:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowBubble(false); // Hide the bubble after a certain amount of time
    }, 500); // Adjust the timeout duration as needed

    return () => clearTimeout(timeoutId);
  }, [totalClaps]);

  const handleUserClap = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/v1/clapsoncomments/users/${id}`
      );
      setUserClaps(response.data);
      setLgShow(true);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching total claps:', error);
    }
  };

  return (
    <Container>
      {!currentUser ? (
        <Button title="Register to clap" className="applause-button">
          <FaHandsClapping size={35} color="#61677A" />
        </Button>
      ) : (
        <button
          type="button"
          className="applause-button"
          onClick={handleClick}
          disabled={totalClaps >= APPLAUSE_MAX}
          title="Clap"
        >
          <div className="claps">
            {totalClaps === 0 && (
              <animated.img
                src={HandsOutline}
                alt="Hands Outline"
                className="hands outline"
              />
            )}
            {totalClaps > 0 && (
              <animated.img src={Hands} alt="Hands" className="hands filled" />
            )}
          </div>

          <animated.div className="spark-container" style={sparkAnimation}>
            <animated.div
              className="spark"
              style={{
                position: 'absolute',
                margin: '-18px 0 0 -18px',
              }}
            >
              <SparkSvg />
            </animated.div>
          </animated.div>

          {showBubble && (
            <animated.div className="bubble" style={bubbleAnimation}>
              +{totalClaps}
            </animated.div>
          )}
        </button>
      )}
      <>
        <button
          onClick={handleUserClap}
          className="counter"
          title="View Users Claps"
        >
          {totalClaps}
        </button>
        <Modal
          show={lgShow}
          size="lg"
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Users who have clapped <img src={users} alt="Hands" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Array.isArray(usersClaps) &&
              usersClaps.map((user, index) => (
                <div key={`${user.id}_${index}`}>
                  <UserClaps>
                    {user.userImage && (
                      <img src={user.userImage} alt={user.fullname} />
                    )}
                    <div> {user.fullname} </div>
                    <div>
                      <FaHandsClapping /> {user.total_claps}{' '}
                    </div>
                  </UserClaps>
                </div>
              ))}
          </Modal.Body>
        </Modal>
      </>
    </Container>
  );
};

ClapsOnComments.propTypes = {
  id: PropTypes.number.isRequired,
};

export default ClapsOnComments;

const Container = styled.div`
  display: flex;
  gap: 0.5rem;

  .applause-button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-left: 0.1rem;
  }

  .applause-button:disabled {
    cursor: not-allowed;
  }

  .applause-button[title]:hover::after {
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

  .fahandsclapping {
    margin-left: 1.5rem;
  }

  .fahandsclapping:disabled {
    cursor: not-allowed;
  }

  .fahandsclapping[title]:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 0.5rem;
    border: none;
  }

  .claps {
    position: relative;
  }

  .hands {
    margin: 0;
    width: 2.5rem;
    height: 2.5rem;
  }

  .spark-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: left;
  }

  .spark {
    width: 20px;
    height: 20px;
    /* You can apply additional styles for the spark effect if needed */
  }

  .bubble {
    position: absolute;
    top: -60px;
    left: 0;
    transform: translateX(-50%);
    background: linear-gradient(
      90deg,
      rgba(131, 58, 180, 1) 0%,
      rgba(253, 58, 29, 1) 50%,
      rgba(252, 176, 69, 1) 100%
    );
    color: white; /* White text color */
    text-align: center; /* Centered text */
    padding: 8px 16px; /* Padding */
    border-radius: 8px; /* Rounded corners */
    font-size: 16px; /* Text size */
  }

  @keyframes bubble {
    0% {
      opacity: 1;
      visibility: visible;
      transform: translateY(-40px);
    }

    60% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform: translateY(-100px);
    }
  }

  .counter {
    background: linear-gradient(
      0deg,
      rgba(34, 193, 195, 1) 0%,
      rgba(165, 108, 108, 1) 100%
    );
    color: white;
    border-radius: 50%;
    padding: 0.5rem;
    border: none;
    position: relative;
  }

  .counter[title]:hover::after {
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
const UserClaps = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    rgba(58, 138, 180, 1) 0%,
    rgba(253, 29, 173, 1) 50%,
    rgba(252, 213, 69, 1) 100%
  );
  color: black;
  font-size: 1.2rem;
  font-weight: bold;
`;
