import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import ModalBodyDevTo from "./ModalBodyDevto";
import handleCrossPostToDevTo from "../utils/devToApi";

const CustomModal = ({
  handlePublishAndDeleteDraft,
  setShowModal,
  showModal,
  title,
  cont,
  image,
  desc,
  category,
  tags,
}) => {
  const [isCrossPostDevTo, setIsCrossPostDevTo] = useState(false);
  const [publishDevTo, setPublishDevTo] = useState(false);
  const handleClose = () => setShowModal(false);
  const [devToken, setDevToken] = useState("");
  const handleCrossPost = async () => {
    await handleCrossPostToDevTo(
      title,
      cont,
      desc,
      image,
      category,
      tags,
      devToken
    );
  };

  const handlePublishAll = async () => {
    await handlePublishAndDeleteDraft();
    await handleClose();

    if (isCrossPostDevTo) {
      await handleCrossPost();
    } else if (publishDevTo) {
      await handleCrossPost();
    }
  };

  return (
    <Modal
      size="lg"
      show={showModal}
      onHide={handleClose}
      animation={false}
      centered
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fs-4 fw-bolder">
          Select The Social Media to Publish
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ModalBodyDevTo
          title={title}
          cont={cont}
          image={image}
          desc={desc}
          category={category}
          tags={tags}
          isCrossPostDevTo={isCrossPostDevTo}
          setIsCrossPostDevTo={setIsCrossPostDevTo}
          handleCrossPost={handleCrossPost}
          publishDevTo={publishDevTo}
          setPublishDevTo={setPublishDevTo}
          devToken={devToken}
          setDevToken={setDevToken}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn btn-primary btn-publish w-25 m-auto"
          variant="primary"
          onClick={handlePublishAll}
        >
          Publish
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;

const CrossPosts = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;

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

  .onoffswitch {
    position: relative;
    width: 90px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .onoffswitch-checkbox {
    display: none;
  }

  .onoffswitch-label {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #999999;
    border-radius: 20px;
  }

  .onoffswitch-inner {
    display: block;
    width: 200%;
    margin-left: -100%;
    -moz-transition: margin 0.3s ease-in 0s;
    -webkit-transition: margin 0.3s ease-in 0s;
    -o-transition: margin 0.3s ease-in 0s;
    transition: margin 0.3s ease-in 0s;
  }

  .onoffswitch-inner:before,
  .onoffswitch-inner:after {
    display: block;
    float: left;
    width: 50%;
    height: 30px;
    padding: 0;
    line-height: 30px;
    font-size: 14px;
    color: white;
    font-family: Trebuchet, Arial, sans-serif;
    font-weight: bold;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .onoffswitch-inner:before {
    content: "YES";
    padding-left: 10px;
    background: linear-gradient(
      109.6deg,
      rgb(162, 2, 63) 11.2%,
      rgb(231, 62, 68) 53.6%,
      rgb(255, 129, 79) 91.1%
    );
    color: #ffffff;
  }

  .onoffswitch-inner:after {
    content: "NO";
    padding-right: 10px;
    background-color: #eeeeee;
    color: #999999;
    text-align: right;
  }

  .onoffswitch-switch {
    display: block;
    width: 18px;
    margin: 6px;
    background: #ffffff;
    border: 2px solid #999999;
    border-radius: 20px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 56px;
    -moz-transition: all 0.3s ease-in 0s;
    -webkit-transition: all 0.3s ease-in 0s;
    -o-transition: all 0.3s ease-in 0s;
    transition: all 0.3s ease-in 0s;
  }

  .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
    margin-left: 0;
  }

  .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
    right: 0px;
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
