import styled from "styled-components";
import React from "react";

import CustomModal from "../components/Modal";

const PublishComponent = ({
  title,
  desc,
  cont,
  cat,
  tags,
  file,
  image,
  postId,
  draftId,
  handleFileChange,
  handleDeleteDraftPost,
  handleCancel,
  handlePublishAndDeleteDraft,
  setCat,
}) => {
  const [showModal, setShowModal] = React.useState(false);

  const handleShowModal = () => setShowModal(true);
  return (
    <Preview>
      <div className="box-1">
        <h1>Publish</h1>
        <span>
          {" "}
          <b>Status: </b> Draft
        </span>
        <span>
          {" "}
          <b>Visibility: </b>Public
        </span>
        <input
          style={{ display: "none" }}
          type="file"
          name="file"
          id="file"
          onChange={handleFileChange}
        />
        <label className="input-file" htmlFor="file">
          Upload Image
        </label>
        {!postId ? (
          <button className="btn" onClick={handleDeleteDraftPost}>
            Delete Draft
          </button>
        ) : (
          <button className="btn" onClick={handleCancel}>
            Cancel Edit
          </button>
        )}
        <h5>
          {image || file
            ? image?.metadata?.name || file?.metadata?.name
            : "No uploaded image"}
        </h5>
        <hr />
        {file?.metadata || image?.metadata?.name ? (
          <div className="actions d-flex justify-content-between gap-3">
            <button className="btn" onClick={handleShowModal}>
              Publish
            </button>
          </div>
        ) : (
          <p> Please before Publish your post select an image</p>
        )}
      </div>
      <div className="box-2">
        <h1>Category</h1>
        <Category>
          <input
            type="radio"
            checked={cat === "Web-Development"}
            name="cat"
            value="Web-Development"
            id="Web-Development"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Web-Development"> Web-Development </label>
        </Category>
        <Category>
          <input
            type="radio"
            name="cat"
            checked={cat === "Cloud-Computing"}
            value="Cloud-Computing"
            id="Cloud-Computing"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Cloud-Computing"> Cloud-Computing</label>
        </Category>
        <Category>
          <input
            type="radio"
            name="cat"
            checked={cat === "DevOps"}
            value="DevOps"
            id="DevOps"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="DevOps"> DevOps </label>
        </Category>
        <Category>
          {" "}
          <input
            type="radio"
            name="cat"
            checked={cat === "Security"}
            value="Security"
            id="Security"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Security"> Security</label>
        </Category>
        <Category>
          <input
            type="radio"
            name="cat"
            checked={cat === "Linux"}
            value="Linux"
            id="Linux"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Linux"> Linux </label>
        </Category>
        <Category>
          <input
            type="radio"
            name="cat"
            checked={cat === "Networking"}
            value="Networking"
            id="Networking"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Networking"> Networking </label>
        </Category>

        <Category>
          <input
            type="radio"
            name="cat"
            checked={cat === "Artificial-Intelligence"}
            value="Artificial-Intelligence"
            id="Artificial-Intelligence"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Artificial-Intelligence">
            {" "}
            Artificial-Intelligence{" "}
          </label>
        </Category>
        <Category>
          <input
            type="radio"
            name="cat"
            checked={cat === "Machine-Learning"}
            value="Machine-Learning"
            id="Machine-Learning"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Machine-Learning"> Machine-Learning </label>
        </Category>
        <Category>
          <input
            type="radio"
            name="cat"
            checked={cat === "Data-Science"}
            value="Data-Science"
            id="Data-Science"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Data-Science"> Data-Science </label>
        </Category>
        <Category>
          <input
            type="radio"
            name="cat"
            checked={cat === "Internet-Of-Things"}
            value="Internet-Of-Things"
            id="Internet-Of-Things"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Internet-Of-Things"> Internet-Of-Things </label>
        </Category>
        <Category>
          <input
            type="radio"
            name="cat"
            checked={cat === "Others"}
            value="Others"
            id="Others"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Others"> Others </label>
        </Category>
      </div>
      <CustomModal
        handlePublishAndDeleteDraft={handlePublishAndDeleteDraft}
        showModal={showModal}
        handleShowModal={handleShowModal}
        setShowModal={setShowModal}
        title={title}
        cont={cont}
        desc={desc}
        image={image || file}
        category={cat}
        tags={tags}
      />
    </Preview>
  );
};

export default PublishComponent;

const Preview = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .box-1,
  .box-2 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 1rem;
    gap: 1rem;
    background-image: linear-gradient(
      to right bottom,
      #1085ae,
      #008795,
      #008470,
      #487e4a,
      #6e732e
    );
    color: #fff;

    .input-file {
      width: 50%;
      padding: 0.5rem;
      border: none;
      border-radius: 5px;
      background-color: #fff;
      color: #000;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      text-align: center;
    }

    .toggle {
      position: absolute;
      width: 0;
      height: 0;
      & + .switch {
        position: relative;
        display: block;
        background: lightgray;
        width: 4cap;
        height: 20px;
        cursor: pointer;
        border-radius: 30px;
        transition: 0.5s;
      }
      &:checked + .switch {
        background: #0cdf73;
      }
      & + .switch:before {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: #0c0e0d;
        border-radius: 50%;
        left: 0%;
        transition: 0.5s;
      }
      &:checked + .switch:before {
        left: 100%;
        transform: translate(calc(-100% - 2px), -50%);
      }
    }
  }

  .actions {
    display: flex;
    justify-content: space-between;

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      background-color: #fff;
      color: #000;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
    }
  }
`;

const Category = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    width: 20px;
    height: 20px;
  }

  label {
    cursor: pointer;
  }
`;
