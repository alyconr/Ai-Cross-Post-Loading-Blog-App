import { useEffect, useState } from "react";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Modal from "react-bootstrap/Modal";
import { CiShare1 } from "react-icons/ci";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTelegram } from "react-icons/fa6";
const Share = ({ post }) => {
  const { currentUser } = useContext(AuthContext);


  const url = window.location.href;

  const [smShow, setSmShow] = useState(false);

  const images = "http://localhost:9000/uploads/${post.image}";

  return (
    <>
      {currentUser && (
        <button
          onClick={() => setSmShow(true)}
          className="message "
          title="Share"
        >
          <CiShare1 className="share" size={35} />
        </button>
      )}

      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        centered
      >
        <Modal.Header className="bg-black text-white " closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Share your thoughts
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center gap-3">
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
              url
            )}&title=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={35} color="blue" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              url
            )}&text=${encodeURIComponent(
              post.title
            )}&source=${encodeURIComponent(images)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaSquareXTwitter size={35} color="black" />
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              post.title
            )}%20${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoWhatsapp size={35} color="green" />
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              url
            )}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram size={35} color="#1681F9" />
          </a>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Share;
