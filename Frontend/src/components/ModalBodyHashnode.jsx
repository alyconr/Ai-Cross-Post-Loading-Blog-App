import styled from "styled-components";
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import save from "../assets/save.png";

const ModalBodyHashnode = ({
  publishHashnodeTo,
  setPublishHashnodeTo,
  isCrossPostHashnodeTo,
  setIsCrossPostHashnodeTo,
  hashnodeToken,
  setHashnodeToken,
  hashnodePublicationId,
  setHashnodePublicationId,
  draftHashnode,
  setDraftHashnode,
}) => {
  const [hashnodeToApiToken, setHashnodeToApiToken] = useState("");

  const [hashnodePublicationIdToApi, setHashnodePublicationIdToApi] =
    useState("");

  const { currentUser } = useContext(AuthContext);

  const handleUpdateHashnodeToken = async () => {
    try {
      const response = await axios.put(
        `http://localhost:9000/api/v1/user/hashnodeToken/${currentUser?.user.id}`,
        {
          hashnodeToken: hashnodeToApiToken,
          hashnodePublicationId: hashnodePublicationIdToApi,
        },
        {
          withCredentials: true,
          credentials: "include",
        }
      );

      console.log(response.data);
      setIsCrossPostHashnodeTo(false);
      setHashnodeToken(response.data.hashnodeToken);
      setHashnodePublicationIdToApi(response.data.hashnodePublicationId);

      toast.success("Hashnode Token and Publication Id Updated Successfully", {
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getHashnodeToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/v1/user/hashnodeToken/${currentUser?.user.id}`,
          {
            withCredentials: true,
            credentials: "include",
          }
        );

        console.log(response.data);
        setIsCrossPostHashnodeTo(false);
        setHashnodeToken(response.data.hashnodeToken);
        setHashnodePublicationId(response.data.hashnodePublicationId);
      } catch (err) {
        console.log(err);
      }
    };
    getHashnodeToken();
  }, []);

  return (
    <div>
      <p>Do you want to publish to Hashnode ?</p>

      <CrossPosts>
        <div className="onoffswitch2">
          <input
            type="checkbox"
            name="onoffswitch2"
            className="onoffswitch2-checkbox"
            id="myonoffswitch2"
            checked={publishHashnodeTo}
            onChange={() => setPublishHashnodeTo(!publishHashnodeTo)}
          />
          <label className="onoffswitch2-label" htmlFor="myonoffswitch2">
            <span className="onoffswitch2-inner"></span>
            <span className="onoffswitch2-switch"></span>
          </label>
        </div>

        {publishHashnodeTo && (
          <>
            {!hashnodeToken && !hashnodePublicationId && (
              <p className="mt-3">
                Please set your Hashnode Token and your Publication Id
              </p>
            )}
            <div className="d-flex gap-2  align-items-start flex-wrap ">
              <input
                type="checkbox"
                role="switch"
                title={
                  hashnodeToken
                    ? "Update Hashnode API Token and Publication Id"
                    : "Save Dev.to API Key"
                }
                id="flexSwitchCheckDisabled"
                className="form-check-input message bg-success "
                checked={
                  hashnodeToken &&
                  hashnodePublicationId &&
                  !isCrossPostHashnodeTo
                }
                onChange={() =>
                  setIsCrossPostHashnodeTo(!isCrossPostHashnodeTo)
                }
              />
              <label
                htmlFor="switch"
                className="switch form-check-label"
              ></label>
              {!isCrossPostHashnodeTo && (
                <p>Hashnode Token and Publication Id are already saved </p>
              )}
              {isCrossPostHashnodeTo && (
                <div className="d-flex flex-column gap-2   ">
                  <input
                    type="text"
                    placeholder={
                      hashnodeToken ? hashnodeToken : "Enter Hashnode Token"
                    }
                    value={hashnodeToApiToken}
                    onChange={(e) => setHashnodeToApiToken(e.target.value)}
                  />
                  <p>Token Set</p>

                  <input
                    type="text"
                    placeholder={
                      hashnodePublicationId
                        ? hashnodePublicationId
                        : "Hashnode Publication Id"
                    }
                    value={hashnodePublicationIdToApi}
                    onChange={(e) =>
                      setHashnodePublicationIdToApi(e.target.value)
                    }
                  />
                  <p>Publication Id Set</p>
                  <button
                    className="message"
                    title="Save Token and Publication Id"
                    onClick={handleUpdateHashnodeToken}
                  >
                    <img src={save} alt="save" />
                  </button>
                </div>
              )}
              {hashnodeToken && (
                <div className="d-flex align-items-start gap-2">
                  <input
                    type="checkbox"
                    role="switch"
                    title="Draft Post"
                    id="flexSwitchCheckDisabled"
                    className="form-check-input message bg-success "
                    checked={draftHashnode}
                    onChange={() => setDraftHashnode(!draftHashnode)}
                  />
                  <label
                    htmlFor="switch"
                    className="switch form-check-label"
                  ></label>
                  <p>Click if you want to Draft the Post</p>
                </div>
              )}
            </div>
          </>
        )}
      </CrossPosts>
    </div>
  );
};

export default ModalBodyHashnode;

const CrossPosts = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.5rem;

  input {
    width: auto;
    height: 30px;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 0.4rem;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  .onoffswitch2 {
    position: relative;
    width: 90px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .onoffswitch2-checkbox {
    display: none;
  }

  .onoffswitch2-label {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #999999;
    border-radius: 20px;
  }

  .onoffswitch2-inner {
    display: block;
    width: 200%;
    margin-left: -100%;
    -moz-transition: margin 0.3s ease-in 0s;
    -webkit-transition: margin 0.3s ease-in 0s;
    -o-transition: margin 0.3s ease-in 0s;
    transition: margin 0.3s ease-in 0s;
  }

  .onoffswitch2-inner:before,
  .onoffswitch2-inner:after {
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

  .onoffswitch2-inner:before {
    content: "YES";
    padding-left: 10px;
    background: hsla(205, 46%, 10%, 1);

    background: linear-gradient(
      90deg,
      hsla(205, 46%, 10%, 1) 0%,
      hsla(191, 91%, 5%, 1) 100%,
      hsla(207, 41%, 27%, 1) 100%
    );

    background: -moz-linear-gradient(
      90deg,
      hsla(205, 46%, 10%, 1) 0%,
      hsla(191, 91%, 5%, 1) 100%,
      hsla(207, 41%, 27%, 1) 100%
    );

    background: -webkit-linear-gradient(
      90deg,
      hsla(205, 46%, 10%, 1) 0%,
      hsla(191, 91%, 5%, 1) 100%,
      hsla(207, 41%, 27%, 1) 100%
    );

    filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#0e1c26", endColorstr="#011216", GradientType=1 );
    color: #ffffff;
  }

  .onoffswitch2-inner:after {
    content: "NO";
    padding-right: 10px;
    background-color: #eeeeee;
    color: #999999;
    text-align: right;
  }

  .onoffswitch2-switch {
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

  .onoffswitch2-checkbox:checked + .onoffswitch2-label .onoffswitch2-inner {
    margin-left: 0;
  }

  .onoffswitch2-checkbox:checked + .onoffswitch2-label .onoffswitch2-switch {
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
