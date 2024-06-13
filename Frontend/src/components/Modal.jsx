import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import handleCrossPostToDevTo from "../utils/devToApi";
import axios from "axios";
import save from "../assets/save.png";
import { useState, useEffect, useContext } from "react";

import { AuthContext } from "../context/authContext";

const CustomModal = ({
  setShowModal,
  showModal,
  title,
  cont,
  desc,
  cat,
  tags,
}) => {
  const [crossPostLoading, setCrossPostLoading] = useState(false);
  const [isCrossPostDevTo, setIsCrossPostDevTo] = useState(false);
  const [devToApiKey, setDevToApiKey] = useState("");
  const [devToken, setDevToken] = useState("");

  const handleClose = () => setShowModal(false);
  const { currentUser } = useContext(AuthContext);
  const handleCrossPost = async () => {
    setCrossPostLoading(true);
    await handleCrossPostToDevTo(
      title,
      cont,
      desc,
      cat,
      tags,
      devToken,
      setCrossPostLoading
    );
  };

  const handleUpdateDevToToken = async () => {
    try {
      const response = await axios.put(
        `http://localhost:9000/api/v1/user/devToken/${currentUser?.user.id}`,
        {
          devToToken: devToApiKey,
        },
        {
          withCredentials: true,
          credentials: "include",
        }
      );

      console.log(response.data);
      setIsCrossPostDevTo(false);
      setDevToken(response.data.devToToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getDevToToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/v1/user/devToken/${currentUser?.user.id}`,
          {
            withCredentials: true,
            credentials: "include",
          }
        );

        console.log(response.data);
        setIsCrossPostDevTo(false);
        setDevToken(response.data.devToToken);
      } catch (error) {
        console.log(error);
      }
    };
    getDevToToken();
  }, []);
  return (
    <Modal
      size="lg"
      show={showModal}
      onHide={handleClose}
      animation={false}
      centered
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Publish Your Article</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!devToken && (
          <p>Please toggle the checkbox if you want to publish to Dev.to</p>
        )}
        <CrossPosts>
          <div className="d-flex flex-row align-items-center gap-2">
            <input
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDisabled"
              className="toggle form-check-input bg-success "
              checked={isCrossPostDevTo}
              onChange={() => setIsCrossPostDevTo(!isCrossPostDevTo)}
            />
            <label htmlFor="switch" className="switch form-check-label"></label>
            {isCrossPostDevTo && (
              <div>
                <input
                  type="text"
                  placeholder="Enter Dev.to API key"
                  value={devToApiKey}
                  onChange={(e) => setDevToApiKey(e.target.value)}
                />
                <button
                  className="message"
                  title="Save"
                  onClick={handleUpdateDevToToken}
                >
                  <img src={save} alt="save" />
                </button>
              </div>
            )}
          </div>

          {devToken && (
            <div>
              <p className="fs-5 fw-bold">DevTo Token is Saved Successfully</p>
              <button
                className="btn-info btn text-black font-weight-bold fs-5"
                onClick={handleCrossPost}
                disabled={crossPostLoading}
              >
                {crossPostLoading ? "Cross-Posting..." : "Publish to Dev.to"}
              </button>
            </div>
          )}
        </CrossPosts>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;

const CrossPosts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  gap: 0.5rem;
  margin-top: -1rem;

  input {
    width: auto;
    height: 30px;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 0.5rem;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
  img {
    width: 25px;
    height: 25px;
    cursor: pointer;
  }

  .message {
    border: none;
    background-color: transparent;
    cursor: pointer;
    width: auto;
    height: auto;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    margin-left: 5px;
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
