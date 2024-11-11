import styled from 'styled-components';
import { useEffect, useState } from 'react';
import CustomModal from '../components/Modal';
import PropTypes from 'prop-types';

const PublishComponent = ({
  title,
  desc,
  cont,
  cat,
  tags,
  image,  
  postId,
  handleFileChange,
  handleDeleteDraftPost,
  handleCancel,
  handlePublishAndDeleteDraft,
  setCat,
  metadataPost,
  imageState,
  
}) => {
  const [showModal, setShowModal] = useState(false);
  const [metadataObject, setMetadataObject] = useState('');


  const getImageDisplay = () => {
    if (imageState.fileData?.metadata?.name) {
      return `Selected Image: ${imageState.fileData.metadata.name}`;
    }
    return postId ? 'Please upload a new image' : 'No image selected';
  };

  const canPublish = () => {
    return imageState.fileData?.metadata?.name || imageState.awsUrl;
  };

  useEffect(() => {
    if (metadataPost) {
      if (typeof metadataPost === 'string') {
        try {
          setMetadataObject(JSON.parse(metadataPost));
        } catch (error) {
          console.error('Failed to parse metadataPost string:', error);
          // Handle the error appropriately
        }
      } else if (typeof metadataPost === 'object' && metadataPost !== null) {
        setMetadataObject(metadataPost);
      } else {
        console.log('metadataPost is neither a string nor an object');
      }
    } else {
      console.log('metadataPost is null or undefined');
    }
  }, [metadataPost, metadataObject]);

  const handleShowModal = () => setShowModal(true);
  return (
    <Preview>
      <div className="box-1">
        <h1>Publish</h1>
        <span>
          {' '}
          <b>Status: </b> Draft
        </span>
        <span>
          {' '}
          <b>Visibility: </b>Public
        </span>
        <input
          style={{ display: 'none' }}
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
          <ImageDisplay>{getImageDisplay()}</ImageDisplay>
        </h5>
        <hr />
        {canPublish() ? (
          <div className="actions d-flex justify-content-between gap-3">
            <button className="btn" onClick={handleShowModal}>
              {postId ? 'Update Post' : 'Publish'}
            </button>
          </div>
        ) : (
          <p>Please select an image before publishing your post</p>
        )}
      </div>
      <div className="box-2">
        <h1>Category</h1>
        <Category>
          <input
            type="radio"
            checked={cat === 'Web-Development'}
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
            checked={cat === 'Cloud-Computing'}
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
            checked={cat === 'DevOps'}
            value="DevOps"
            id="DevOps"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="DevOps"> DevOps </label>
        </Category>
        <Category>
          {' '}
          <input
            type="radio"
            name="cat"
            checked={cat === 'Security'}
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
            checked={cat === 'Linux'}
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
            checked={cat === 'Networking'}
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
            checked={cat === 'Artificial-Intelligence'}
            value="Artificial-Intelligence"
            id="Artificial-Intelligence"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="Artificial-Intelligence">
            {' '}
            Artificial-Intelligence{' '}
          </label>
        </Category>
        <Category>
          <input
            type="radio"
            name="cat"
            checked={cat === 'Machine-Learning'}
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
            checked={cat === 'Data-Science'}
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
            checked={cat === 'Internet-Of-Things'}
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
            checked={cat === 'Others'}
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
        image={image} // Use either source of the URL
        category={cat}
        tags={tags}
      />
    </Preview>
  );
};

PublishComponent.propTypes = {
  title: PropTypes.string,
  cont: PropTypes.string,
  desc: PropTypes.string,
  // Update image prop type to accept either string or object
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      base64String: PropTypes.string,
      metadata: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        size: PropTypes.number,
      }),
    }),
  ]),
  cat: PropTypes.string,
  postId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Also fixing postId
  tags: PropTypes.arrayOf(PropTypes.string),
  // Update file prop type to match image structure
  file: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      base64String: PropTypes.string,
      metadata: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        size: PropTypes.number,
      }),
    }),
  ]),
  awsUrlS3: PropTypes.string,
  imageState: PropTypes.shape({
    fileData: PropTypes.shape({
      base64String: PropTypes.string,
      metadata: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        size: PropTypes.number,
      }),
    }),
    awsUrl: PropTypes.string,
    metadata: PropTypes.object,
  }),
  setImageState: PropTypes.func,
  handlePublishAndDeleteDraft: PropTypes.func,
  handleFileChange: PropTypes.func,
  handleDeleteDraftPost: PropTypes.func,
  handleCancel: PropTypes.func,
  setCat: PropTypes.func,
  metadataPost: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default PublishComponent;

const ImageDisplay = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin: 0.5rem 0;
  color: #fff;
`;

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
        content: '';
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
