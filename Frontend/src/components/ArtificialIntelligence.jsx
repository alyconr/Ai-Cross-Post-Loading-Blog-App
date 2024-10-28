import styled from 'styled-components';
import AiModal from './AiModal';
import { useState } from 'react';
const ArtificialIntelligenceComponent = () => {
  const handleClose = () => setAiAgent(false);

  const handleToggle = () => setAiAgent(!aiAgent);

  const [aiAgent, setAiAgent] = useState(false);

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
      <AiModal aiAgent={aiAgent} handleClose={handleClose} />
    </Container>
  );
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

  .onoffswitch-ai {
    position: relative;
    width: 90px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .onoffswitch-checkbox-ai {
    display: none;
  }

  .onoffswitch-label-ai {
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

  .onoffswitch-inner-ai:after {
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

  .onoffswitch-checkbox-ai:checked
    + .onoffswitch-label-ai
    .onoffswitch-inner-ai {
    margin-left: 0;
  }

  .onoffswitch-checkbox-ai:checked
    + .onoffswitch-label-ai
    .onoffswitch-switch-ai {
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
