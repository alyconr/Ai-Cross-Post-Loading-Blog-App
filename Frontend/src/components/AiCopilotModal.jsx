import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import save from '../assets/save.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
const AiCopilotModal = ({ copilot, handleCloseCopilot }) => {
  const { currentUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [openAiApiKey, setOpenAiApiKey] = useState('');
  const [openAiApiKeySaved, setOpenAiApiKeySaved] = useState('');

  const handleApiKeySubmit = async (e) => {
    e.preventDefault();
    await handleSaveOpenAiApiKey();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveOpenAiApiKey = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URI}/user/openAiApiKey/${currentUser?.user.id}`,
        {
          openAiApiKey
        },
        {
          withCredentials: true,
          credentiasl: 'include'
        }
      );

      setOpenAiApiKeySaved(response.data.openAiApiKey);
      toast.success('OpenAi API key saved successfully!');
    } catch (error) {
      console.error('Error saving OpenAi API Key:', error);
    }
  };

  useEffect(() => {
    const getOpenAiApiKey = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/user/openAiApiKey/${currentUser?.user.id}`,
          {
            withCredentials: true,
            credentials: 'include'
          }
        );
        setOpenAiApiKeySaved(response.data.openAiApiKey);
      } catch (error) {
        console.error('Error getting OpenAi API key:', error);
      }
    };

    getOpenAiApiKey();
  }, [currentUser?.user.id]);
  return (
    <div>
      <Modal show={copilot} onHide={handleCloseCopilot}>
        <Modal.Header closeButton>
          <Modal.Title>OpenAi API Key</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <p>
              Enter Your OpenAi API key{' '}
              <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer">
                OpenAi API key
              </a>
            </p>
            <div className="openai-key">
              <PasswordInputWrapper>
                <StyledInput
                  type={showPassword || !openAiApiKeySaved ? 'text' : 'password'}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOpenAiApiKey(value);
                    setOpenAiApiKeySaved(value);
                  }}
                  value={openAiApiKeySaved || openAiApiKey || ''}
                />
                <TogglePasswordButton onClick={togglePasswordVisibility} type="button">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </TogglePasswordButton>
              </PasswordInputWrapper>

              <OpenaiButton title="Save" onClick={handleApiKeySubmit}>
              <img src={save} alt="save"  />
              </OpenaiButton>            
              
            </div>
          </InputGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

AiCopilotModal.propTypes = {
  copilot: PropTypes.bool.isRequired,
  handleCloseCopilot: PropTypes.func.isRequired
};

export default AiCopilotModal;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  text-align: center;
  

  p {
    margin-bottom: 0.5rem;
  }
`;
const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f9fa;
  color: #333;
`;

const OpenaiButton = styled(Button)`
  position: relative;
  background: transparent;
  border: none;
  width: 5%;
  cursor: pointer;

  img {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  &:hover {
    background: transparent;
  }
`;
