import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import ModalBodyDevTo from "./ModalBodyDevto";
import handleCrossPostToDevTo from "../utils/devToApi";
import handleCrossPostToMedium from "../utils/mediumToApi";
import handleCrossPostToHashnode from "../utils/hashnodeToApi";
import ModalBodyMedium from "./ModalBodyMedium";
import ModalBodyHashnode from "./ModalBodyHashnode";
import PropTypes from "prop-types";

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
  const [draftHashnode, setDraftHashnode] = useState(false);
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
      mediumToken,
      draftMedium
    );
  };

  const handlePostHashnodeTo = async () => {
    
    await handleCrossPostToHashnode(
      title,
      cont,
      desc,
      image,
      tags,
      hashnodeToken,
      hashnodePublicationId,
      draftHashnode
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
          setDevToken={setDevToken}
          draftDevto={draftDevto}
          setDraftDevto={setDraftDevto}
        />
        <ModalBodyMedium
          isCrossPostMediumTo={isCrossPostMediumTo}
          setIsCrossPostMediumTo={setIsCrossPostMediumTo}
          publishMediumTo={publishMediumTo}
          setPublishMediumTo={setPublishMediumTo}
          mediumToken={mediumToken}
          setMediumToken={setMediumToken}
          draftMedium={draftMedium}
          setDraftMedium={setDraftMedium}
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
          draftHashnode={draftHashnode}
          setDraftHashnode={setDraftHashnode}
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

CustomModal.propTypes = {
  handlePublishAndDeleteDraft: PropTypes.func,
  setShowModal: PropTypes.func,
  showModal: PropTypes.bool,
  title: PropTypes.string,
  cont: PropTypes.string,
  // Update image prop type to match the actual data structure
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      base64String: PropTypes.string,
      metadata: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        size: PropTypes.number
      })
    })
  ]),
  desc: PropTypes.string,
  category: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  publishMediumTo: PropTypes.func,
};

export default CustomModal;
