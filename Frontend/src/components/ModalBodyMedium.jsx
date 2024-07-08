import styled from "styled-components";
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import save from "../assets/save.png";

const ModalBodyMedium = ({
  publishMediumTo,
  setPublishMediumTo,
  isCrossPostMediumTo,
  setIsCrossPostMediumTo,
  mediumToken,
  setMediumToken,
  draftMedium,
  setDraftMedium,
}) => {
  const [mediumToApiToken, setMedumToApiToken] = useState("");

  const { currentUser } = useContext(AuthContext);

  const handleUpdateMediumToken = async (e) => {
    try {
      const response = await axios.put(
        `http://localhost:9000/api/v1/user/mediumToken/${currentUser?.user.id}`,
        {
          mediumToken: mediumToApiToken,
        },
        {
          withCredentials: true,
          credentials: "include",
        }
      );

      console.log(response.data);
      setIsCrossPostMediumTo(false);
      setMediumToken(response.data.mediumToken);

      toast.success("Medium Token Updated Successfully", {
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
    const getMediumToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/v1/user/mediumToken/${currentUser?.user.id}`,
          {
            withCredentials: true,
            credentials: "include",
          }
        );
        console.log(response.data);
        setIsCrossPostMediumTo(false);
        setMediumToken(response.data.mediumToken);
      } catch (error) {
        console.log(error);
      }
    };
    getMediumToken();
  }, []);

  return (
    <div>
      <p className="mt-3">Do you want to publish to Medium?</p>
      <CrossPosts>
        <div className="onoffswitch1">
          <input
            type="checkbox"
            name="onoffswitch1"
            className="onoffswitch1-checkbox"
            id="myonoffswitch1"
            checked={publishMediumTo}
            onChange={() => setPublishMediumTo(!publishMediumTo)}
          />
          <label className="onoffswitch1-label" htmlFor="myonoffswitch1">
            <span className="onoffswitch1-inner"></span>
            <span className="onoffswitch1-switch"></span>
          </label>
        </div>

        {publishMediumTo && (
          <>
            <div className="d-flex flex-wrap">
              {!mediumToken && (
                <p className="mt-3">
                  Please toggle the checkbox to set your Medium Token
                </p>
              )}
              <div className="d-flex gap-2 me-2 align-items-center">
                <input
                  type="checkbox"
                  role="switch"
                  title={
                    mediumToken ? "Update Medium Api Key" : "Save Medium Token"
                  }
                  id="flexSwitchCheckDisabled"
                  className="form-check-input message bg-success "
                  checked={mediumToken && !isCrossPostMediumTo}
                  onChange={() => setIsCrossPostMediumTo(!isCrossPostMediumTo)}
                />
                <label
                  htmlFor="switch"
                  className="switch form-check-label"
                ></label>
                <p className="mt-3">Token is already set</p>
                {isCrossPostMediumTo && (
                  <div>
                    <input
                      type="text"
                      placeholder={
                        mediumToken ? mediumToken : "Enter Medium Token"
                      }
                      value={mediumToApiToken}
                      onChange={(e) => setMedumToApiToken(e.target.value)}
                    />
                    <button
                      className="message"
                      title="Save Medium Token"
                      onClick={handleUpdateMediumToken}
                    >
                      <img src={save} alt="save" />
                    </button>
                  </div>
                )}
              </div>

              {mediumToken && (
                <div className="d-flex gap-2  align-items-center  ">
                  <input
                    type="checkbox"
                    role="switch"
                    title="Draft Post"
                    id="flexSwitchCheckDisabled"
                    className="form-check-input message bg-success "
                    checked={draftMedium}
                    onChange={() => setDraftMedium(!draftMedium)}
                  />
                  <label
                    htmlFor="switch"
                    className="switch form-check-label"
                  ></label>
                  <p className="mt-3">Click if you want to Draft the Post</p>
                </div>
              )}
            </div>
          </>
        )}
      </CrossPosts>
    </div>
  );
};
export default ModalBodyMedium;

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

  .onoffswitch1 {
    position: relative;
    width: 90px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .onoffswitch1-checkbox {
    display: none;
  }

  .onoffswitch1-label {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #999999;
    border-radius: 20px;
  }

  .onoffswitch1-inner {
    display: block;
    width: 200%;
    margin-left: -100%;
    -moz-transition: margin 0.3s ease-in 0s;
    -webkit-transition: margin 0.3s ease-in 0s;
    -o-transition: margin 0.3s ease-in 0s;
    transition: margin 0.3s ease-in 0s;
  }

  .onoffswitch1-inner:before,
  .onoffswitch1-inner:after {
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

  .onoffswitch1-inner:before {
    content: "YES";
    padding-left: 10px;
    background: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
    color: #ffffff;
  }

  .onoffswitch1-inner:after {
    content: "NO";
    padding-right: 10px;
    background-color: #eeeeee;
    color: #999999;
    text-align: right;
  }

  .onoffswitch1-switch {
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

  .onoffswitch1-checkbox:checked + .onoffswitch1-label .onoffswitch1-inner {
    margin-left: 0;
  }

  .onoffswitch1-checkbox:checked + .onoffswitch1-label .onoffswitch1-switch {
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
