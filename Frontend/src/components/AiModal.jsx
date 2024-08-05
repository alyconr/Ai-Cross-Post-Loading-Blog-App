import { useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom"
import { AuthContext } from "../context/authContext";

const AiModal = ({ aiAgent, handleClose }) => {
    const { currentUser } = useContext(AuthContext);
  return (
    <>
      <Modal show={aiAgent} onHide={handleClose} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title>
            GREAT, THIS IS YOU AI AGENT BASED ON OPEN AI MODEL
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="d-flex flex-column align-items-center">
          <div className="d-flex justify-content-center flex-column align-items-center p-3 bg-light rounded border w-50 ">
            <p>Enter The number of web references (Max 10)</p>
            <input
              className="w-50 mb-3 rounded border-0 bg-dark text-white"
              type="number"
              min="1"
              max="10"
                          placeholder="Enter The number of web references"
                          
            />

            <p>Enter Your OpenAi API key <a href="https://platform.openai.com/">OpenAi API key</a></p>
            <input
               className="w-50 mb-3 rounded border-0 bg-dark text-white"
              type="text"
              placeholder="Enter Your OpenAi API key"
            />

            <p>Enter The topic that you want to generate</p>
            <input
               className="w-50 mb-3 rounded border-0 bg-dark text-white"
              type="text"
              placeholder="Enter The topic that you want to generate"
            />

            <Button className="p-2 mb-3" variant="primary" type="submit">
              Generate Blog
                      </Button>
                      <p>Don't you know how to use our AI agents yet? <Link to={`/Dashboard/${currentUser.user.name}`}>Click here</Link> to our AiAgents FAQ's </p>
          </div>
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
    </>
  );
};

export default AiModal;
