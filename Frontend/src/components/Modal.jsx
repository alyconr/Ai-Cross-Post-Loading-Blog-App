import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import ModalBodyDevTo from "./ModalBodyDevto";
import handleCrossPostToDevTo from "../utils/devToApi";
import handleCrossPostToMedium from "../utils/mediumToApi";
import ModalBodyMedium from "./ModalBodyMedium";

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
  const [isCrossPostMediumTo, setIsCrossPostMediumTo] = useState(false);
  const [publishDevTo, setPublishDevTo] = useState(false);
  const [publishMediumTo, setPublishMediumTo] = useState(false);
  const [devToken, setDevToken] = useState("");
  const [mediumToken, setMediumToken] = useState("");
  const handleClose = () => setShowModal(false);
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
    await handleCrossPostToMedium(
      title,
      cont,
      desc,
      image,
      category,
      tags,
      mediumToken
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
          isCrossPostDevTo={isCrossPostDevTo}
          setIsCrossPostDevTo={setIsCrossPostDevTo}
          publishDevTo={publishDevTo}
          setPublishDevTo={setPublishDevTo}
          devToken={devToken}
          setDevToken={setDevToken}
        />
        <ModalBodyMedium
          isCrossPostMediumTo={isCrossPostMediumTo}
          setIsCrossPostMediumTo={setIsCrossPostMediumTo}
          publishMediumTo={publishMediumTo}
          setPublishMediumTo={setPublishMediumTo}
          mediumToken={mediumToken}
          setMediumToken={setMediumToken}
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

