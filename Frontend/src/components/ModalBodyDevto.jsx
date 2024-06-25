import styled from "styled-components";
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import save from "../assets/save.png";

const ModalBodyDevTo = ({
  publishDevTo, // Accept the state here
  setPublishDevTo, // Accept the setter function here
  isCrossPostDevTo,
  setIsCrossPostDevTo,
  devToken,
  setDevToken,
}) => {
  const [devToApiKey, setDevToApiKey] = useState("");

  const { currentUser } = useContext(AuthContext);

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

      toast.success("DevTo Token Updated Successfully", {
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
    <div>
      <p>Do you want to publish to Dev.to?</p>
      <CrossPosts>
        <div className="onoffswitch">
          <input
            type="checkbox"
            name="onoffswitch"
            className="onoffswitch-checkbox"
            id="myonoffswitch"
            checked={publishDevTo}
            onChange={() => setPublishDevTo(!publishDevTo)}
          />
          <label className="onoffswitch-label" for="myonoffswitch">
            <span className="onoffswitch-inner"></span>
            <span className="onoffswitch-switch"></span>
          </label>
        </div>

        {publishDevTo && (
          <>
            {!devToken && (
              <p className="mt-3">
                Please toggle the checkbox to set your Dev.to API key
              </p>
            )}

            <input
              type="checkbox"
              role="switch"
              title={devToken ? "Update Dev.to API Key" : "Save Dev.to API Key"}
              id="flexSwitchCheckDisabled"
              className="form-check-input message bg-success "
              checked={devToken && !isCrossPostDevTo}
              onChange={() => setIsCrossPostDevTo(!isCrossPostDevTo)}
            />
            <label htmlFor="switch" className="switch form-check-label"></label>

            {isCrossPostDevTo && (
              <div>
                <input
                  type="text"
                  placeholder={devToken ? devToken : "Enter Dev.to API Key"}
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

            {devToken && (
              <div>
                <p className="mt-3">DevTo Token is already saved </p>
              </div>
            )}
          </>
        )}
      </CrossPosts>
    </div>
  );
};

export default ModalBodyDevTo;

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
