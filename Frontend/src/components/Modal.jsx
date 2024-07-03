import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import ModalBodyDevTo from "./ModalBodyDevto";
import handleCrossPostToDevTo from "../utils/devToApi";
import handleCrossPostToMedium from "../utils/mediumToApi";
import handleCrossPostToHashnode from "../utils/hashnodeToApi";
import ModalBodyMedium from "./ModalBodyMedium";
import ModalBodyHashnode from "./ModalBodyHashnode";

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
  const [isCrossPostHashnodeTo, setIsCrossPostHashnodeTo] = useState(false);
  const [publishDevTo, setPublishDevTo] = useState(false);
  const [publishMediumTo, setPublishMediumTo] = useState(false);
  const [publishHashnodeTo, setPublishHashnodeTo] = useState(false);
  const [draftDevto, setDraftDevto] = useState(false);
  const [draftMedium, setDraftMedium] = useState(false);
  const [devToken, setDevToken] = useState("");
  const [mediumToken, setMediumToken] = useState("");
  const [hashnodeToken, setHashnodeToken] = useState("");
  const [hashnodePublicationId, setHashnodePublicationId] = useState("");

  const handleClose = () => setShowModal(false);
  const handlePostDevTo = async () => {
    await handleCrossPostToDevTo(
      title,
      cont,
      desc,
      image,
      category,
      tags,
      devToken,
      draftDevto
    );
  };
  const handlePostMediumTo = async () => {
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

  const handlePostHashnodeTo = async () => {
    await handleCrossPostToHashnode(
      title,
      cont,
      desc,
      image,
      category,
      tags,
      hashnodeToken,
      hashnodePublicationId
    );
  };

  const handlePublishAll = async () => {
    await handlePublishAndDeleteDraft();
    await handleClose();

    if (publishDevTo === true) {
      await handlePostDevTo();
    }

    if (publishMediumTo === true) {
      await handlePostMediumTo();
    }

    if (publishHashnodeTo === true) {
      await handlePostHashnodeTo();
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
          setDevToken={ setDevToken }
          draftDevto={ draftDevto }
          setDraftDevto={ setDraftDevto }
        />
        <ModalBodyMedium
          isCrossPostMediumTo={isCrossPostMediumTo}
          setIsCrossPostMediumTo={setIsCrossPostMediumTo}
          publishMediumTo={publishMediumTo}
          setPublishMediumTo={setPublishMediumTo}
          mediumToken={mediumToken}
          setMediumToken={setMediumToken}
        />
        <ModalBodyHashnode
          isCrossPostHashnodeTo={isCrossPostHashnodeTo}
          setIsCrossPostHashnodeTo={setIsCrossPostHashnodeTo}
          publishHashnodeTo={publishHashnodeTo}
          setPublishHashnodeTo={setPublishHashnodeTo}
          hashnodeToken={hashnodeToken}
          setHashnodeToken={setHashnodeToken}
          hashnodePublicationId={hashnodePublicationId}
          setHashnodePublicationId={setHashnodePublicationId}
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
