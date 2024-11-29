import styled from 'styled-components';
import AiModal from './AiModal';
import { AuthContext } from '../context/authContext';
import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import AiCopilotModal from './AiCopilotModal';
import axios from 'axios';

const ArtificialIntelligenceComponent = ({ onCopilotChange }) => {
  const { currentUser } = useContext(AuthContext);
  const [aiAgent, setAiAgent] = useState(false);
  const [copilot, setCopilot] = useState(false);
  const [openAiApiKey, setOpenAiApiKey] = useState('');
  const [aiCopilot, setAiCopilot] = useState(false);

  const handleClose = () => setAiAgent(false);
  const handleCloseCopilot = () => setAiCopilot(false);

  const handleToggle = () => setAiAgent(!aiAgent);

  const handleToggleCopilot = () => {
    const newState = !copilot;
    setCopilot(newState);
    setAiCopilot(newState);
    onCopilotChange({ enabled: newState, apiKey: openAiApiKey }); // Pass the state up to parent
  };

  const handleApiKeySave = (newApiKey) => {
    setOpenAiApiKey(newApiKey);
    if (copilot) {
      onCopilotChange({ enabled: true, apiKey: newApiKey });
    }
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      if (currentUser?.user.id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URI}/user/openAiApiKey/${currentUser.user.id}`,
            {
              withCredentials: true,
              credentials: 'include'
            }
          );
          const apiKey = response.data.openAiApiKey;
          setOpenAiApiKey(apiKey);
          // Update parent component with current state and API key
          if (copilot) {
            onCopilotChange({ enabled: copilot, apiKey });
          }
        } catch (error) {
          console.error('Error fetching OpenAI API key:', error);
          setOpenAiApiKey('');
          onCopilotChange({ enabled: false, apiKey: '' });
        }
      }
    };

    fetchApiKey();
  }, [currentUser?.user.id, copilot]);

  return (
    <Container>
      <h2>Do you want to write your post with our AI AGENT?</h2>
      <div className="onoffswitch-ai">
        <input
          type="checkbox"
          name="onoffswitch-ai"
          className="onoffswitch-checkbox-ai"
          id="myonoffswitch"
          checked={aiAgent}
          onChange={handleToggle}
        />
        <label className="onoffswitch-label-ai" htmlFor="myonoffswitch">
          <span className="onoffswitch-inner-ai"></span>
          <span className="onoffswitch-switch-ai"></span>
        </label>
      </div>
      <h2>Do you want to enable Copilot Feature to write your post?</h2>
      <div className="onoffswitch-copilot">
        <input
          type="checkbox"
          name="onoffswitch-copilot"
          className="onoffswitch-checkbox-copilot"
          id="myonoffswitchcopilot"
          checked={copilot}
          onChange={handleToggleCopilot}
          disabled={!openAiApiKey}
        />
        <label className="onoffswitch-label-copilot" htmlFor="myonoffswitchcopilot">
          <span className="onoffswitch-inner-copilot"></span>
          <span className="onoffswitch-switch-copilot"></span>
        </label>
      </div>
      {!openAiApiKey && copilot && (
        <div className="warning-message">
          Please add your OpenAI API key to use the Copilot feature
        </div>
      )}
      <AiModal aiAgent={aiAgent} handleClose={handleClose} id="aiModal" />
      <AiCopilotModal
        copilot={aiCopilot}
        handleCloseCopilot={handleCloseCopilot}
        id="copilotModal"
        onApiKeySave={handleApiKeySave}
      />
    </Container>
  );
};

ArtificialIntelligenceComponent.propTypes = {
  onCopilotChange: PropTypes.func.isRequired
};

export default ArtificialIntelligenceComponent;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

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
  .warning-message {
    color: #ff4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-style: italic;
  }

  .onoffswitch-checkbox-copilot:disabled + .onoffswitch-label-copilot {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .onoffswitch-ai {
    position: relative;
    width: 90px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .onoffswitch-copilot {
    position: relative;
    width: 90px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .onoffswitch-checkbox-ai {
    display: none;
  }

  .onoffswitch-checkbox-copilot {
    display: none;
  }

  .onoffswitch-label-ai {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #999999;
    border-radius: 20px;
  }

  .onoffswitch-label-copilot {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #999999;
    border-radius: 20px;
  }

  .onoffswitch-inner-ai {
    display: block;
    width: 200%;
    margin-left: -100%;
    -moz-transition: margin 0.3s ease-in 0s;
    -webkit-transition: margin 0.3s ease-in 0s;
    -o-transition: margin 0.3s ease-in 0s;
    transition: margin 0.3s ease-in 0s;
  }

  .onoffswitch-inner-copilot {
    display: block;
    width: 200%;
    margin-left: -100%;
    -moz-transition: margin 0.3s ease-in 0s;
    -webkit-transition: margin 0.3s ease-in 0s;
    -o-transition: margin 0.3s ease-in 0s;
    transition: margin 0.3s ease-in 0s;
  }

  .onoffswitch-inner-ai:before,
  .onoffswitch-inner-ai:after {
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

  .onoffswitch-inner-copilot:before,
  .onoffswitch-inner-copilot:after {
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

  .onoffswitch-inner-ai:before {
    content: 'YES';
    padding-left: 10px;
    background: linear-gradient(
      109.6deg,
      rgb(162, 2, 63) 11.2%,
      rgb(231, 62, 68) 53.6%,
      rgb(255, 129, 79) 91.1%
    );
    color: #ffffff;
  }

  .onoffswitch-inner-copilot:before {
    content: 'YES';
    padding-left: 10px;
    background: linear-gradient(
      109.6deg,
      rgb(162, 2, 63) 11.2%,
      rgb(231, 62, 68) 53.6%,
      rgb(255, 129, 79) 91.1%
    );
    color: #ffffff;
  }

  .onoffswitch-inner-ai:after {
    content: 'NO';
    padding-right: 10px;
    background-color: #eeeeee;
    color: #999999;
    text-align: right;
  }

  .onoffswitch-inner-copilot:after {
    content: 'NO';
    padding-right: 10px;
    background-color: #eeeeee;
    color: #999999;
    text-align: right;
  }

  .onoffswitch-switch-ai {
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

  .onoffswitch-switch-copilot {
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

  .onoffswitch-checkbox-ai:checked + .onoffswitch-label-ai .onoffswitch-inner-ai {
    margin-left: 0;
  }

  .onoffswitch-checkbox-copilot:checked + .onoffswitch-label-copilot .onoffswitch-inner-copilot {
    margin-left: 0;
  }

  .onoffswitch-checkbox-ai:checked + .onoffswitch-label-ai .onoffswitch-switch-ai {
    right: 0px;
  }
  .onoffswitch-checkbox-copilot:checked + .onoffswitch-label-copilot .onoffswitch-switch-copilot {
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
