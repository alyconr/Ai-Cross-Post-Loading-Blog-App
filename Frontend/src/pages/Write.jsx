import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { debounced } from "../utils/debounce";
import TagsInput from "../components/tags";
import PublishComponent from "../components/PublishComponent";

import { MdOutlineOpenInNew } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  fileToBase64WithMetadata,
  base64ToFile,
  
} from "../utils/uploadImagesUtils";
import ArtificialIntelligenceComponent from "../components/ArtificialIntelligence";

const Write = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const draftParamId = new URLSearchParams(location.search).get("draftId");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState(location?.state?.description || "");
  const [cont, setCont] = useState(location?.state?.content || "");
  const [file, setFile] = useState("");
  const [cat, setCat] = useState(location?.state?.category || "");
  const [tags, setTags] = useState(
    Array.isArray(location?.state?.tags) ? location.state.tags : []
  );
  const [draftId, setDraftId] = useState(draftParamId);
  const [postId, setPostId] = useState(location?.state?.pid || "");
  const [metadataPost, setMetadataPost] = useState();

  const [image, setImage] = useState("");
  console.log(metadataPost);
  console.log(file);
  console.log(image);
  const [showPublishComponent, setShowPublishComponent] = useState(true);

  const handleToggle = (event) => {
    event.preventDefault();
    setShowPublishComponent(!showPublishComponent);
  };
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const { base64String, metadata } = await fileToBase64WithMetadata(selectedFile);
        const fileData = { base64String, metadata };
        
        if (postId) {
          setImage(fileData);
          localStorage.setItem("uploadedImage", JSON.stringify(fileData));
        } else {
          setFile(fileData);
          localStorage.setItem("uploadedFile", JSON.stringify(fileData));
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error processing file. Please try again.");
      }
    }
  };

  useEffect(() => {
    const savedFile = localStorage.getItem("uploadedFile");
    if (savedFile && draftId) {
      setFile(JSON.parse(savedFile));
    } else {
      const savedImage = localStorage.getItem("uploadedImage");
      if (savedImage) {
        setImage(JSON.parse(savedImage));
      }
    }
  }, []);

  const saveDraftAndPostAutomatically = async () => {
    if (title && desc && cont && cat && tags) {
      try {
        let endpoint;
        let method;

        if (postId) {
          endpoint = `http://localhost:9000/api/v1/posts/${location.state.pid}`;
          method = "put";
        } else if (draftId) {
          endpoint = `http://localhost:9000/api/v1/draftposts/${draftId}`;
          method = "put";
        } else {
          endpoint = "http://localhost:9000/api/v1/draftposts";
          method = "post";
        }

        const imageUrl = file?.metadata?.name || image?.metadata?.name;
       
        
        const metadata = JSON.parse(localStorage.getItem("uploadedImage"));
        console.log(metadata)

        const metadataUrl = `http://localhost:9000/uploads/${metadata.metadata.name}`

        const response = await axios({
          method: method,
          url: endpoint,
          data: {
            title,
            description: desc,
            content: cont,
            image: !postId ? imageUrl : metadataUrl,
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            category: cat,
            tags,
            metadata: metadata?.metadata,
          },
          withCredentials: true,
        });

        if (!postId && !draftId) {
          const newDraftId = response.data.post;
          setDraftId(newDraftId);
        }

        toast.info(
          postId ? "Post updated successfully" : "Draft saved successfully",
          {
            position: "bottom-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
      } catch (err) {
        console.error("Error saving draft:", err);
        toast.error("Error saving draft");
      }
    }
  };

  useEffect(() => {
    const debounceSaveDraft = debounced.debounced(
      saveDraftAndPostAutomatically,
      2000
    );

    // Listen for changes in title, desc, cont, cat, and file
    debounceSaveDraft();

    return () => {
      debounced.cancel();
    };
  }, [title, desc, cont, image, cat, tags, postId, draftId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint;
        if (postId) {
          endpoint = `http://localhost:9000/api/v1/posts/${postId}`;
        } else if (draftId) {
          endpoint = `http://localhost:9000/api/v1/draftposts/${draftId}`;
        } else {
          return;
        }

        const response = await axios({
          method: "get",
          url: endpoint,
          withCredentials: true,
        });

        const data = response.data;
        console.log("Fetched data:", data);

        if (data.post) {
          // Handle single post or draft
          const postData = data.post;
          setTitle(postData?.title || "");
          setDesc(postData?.description || "");
          setCont(postData?.content || "");
          setCat(postData?.category || "");
          setTags(Array.isArray(postData?.tags) ? postData.tags : []);
          setImage(postData?.metadata ? JSON.parse(postData.metadata) : "");
          setMetadataPost(
            postData?.metadata ? JSON.parse(postData.metadata) : ""
          );
        } else if (data.posts && data.posts.length > 0) {
          // Handle multiple drafts (though we're only using the first one)
          const draftData = data.posts[0];
          setTitle(draftData?.title || "");
          setDesc(draftData?.description || "");
          setCont(draftData?.content || "");
          setCat(draftData?.category || "");
          setTags(Array.isArray(draftData?.tags) ? draftData.tags : []);
          setImage(draftData?.metadata ? JSON.parse(draftData.metadata) : "");
        }
      } catch (err) {
        console.log(err);
      }
    };
    // Only fetch draft data when the component mounts

    fetchData();
  }, [draftId, postId]);

  const handleDeleteDraftPost = async () => {
    if (!postId) {
      try {
        // Delete the draftId from localStorage
        localStorage.removeItem("draftId");
        localStorage.removeItem("uploadedFile");
        localStorage.removeItem("uploadedImage");
        // Set the state to null or an appropriate value

        await axios.delete(`http://localhost:9000/api/v1/draftposts`, {
          withCredentials: true,
        });
        setTitle("");
        setDesc("");
        setCont("");
        setDesc(" ");
        setFile("");
        setImage("");
        setDraftId("");
        navigate("/");
        window.location.reload();
        toast.info("Draft deleted successfully", {
          position: "bottom-right",
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
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handlePublish = async () => {
  if (!title || !desc || !cont || !cat) {
    toast.error("Please fill all the fields");
    return;
  }

  try {
    let fileUrl = "";

    if (file || image) {
      toast.info("Uploading image...", {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      let fileObject;

      if (file && file.base64String) {
        fileObject = base64ToFile(
          file.base64String,
          file.metadata?.name || "image.jpg",
          file.metadata?.type || "image/jpeg"
        );
      } else if (image && image.base64String) {
        fileObject = base64ToFile(
          image.base64String,
          image.metadata?.name || "image.jpg",
          image.metadata?.type || "image/jpeg"
        );
      } else if (image instanceof File) {
        fileObject = image;
      }

      if (fileObject) {
        const formData = new FormData();
        formData.set("file", fileObject);

        const res = await axios.post(
          "http://localhost:9000/api/v1/upload",
          formData
        );
        const filename = res.data;

        fileUrl = `http://localhost:9000/uploads/${filename}`;
      }
    }

    const metadata = localStorage.getItem("uploadedImage")
      ? JSON.parse(localStorage.getItem("uploadedImage"))
      : null;

    const postData = {
      title,
      description: desc,
      content: cont,
      image: fileUrl,
      date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      category: cat,
      tags,
      metadata,
    };

    if (location.state?.pid) {
      await axios({
        method: "put",
        url: `http://localhost:9000/api/v1/posts/${location.state.pid}`,
        data: postData,
        withCredentials: true,
      });
    } else {
      await axios({
        method: "post",
        url: "http://localhost:9000/api/v1/posts",
        data: postData,
        withCredentials: true,
      });
    }

    toast.success("Post published successfully", {
      position: "bottom-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    navigate("/");
  } catch (err) {
    console.error(err);
    toast.error("Error uploading image or publishing post");
  }
};

  const handlePublishAndDeleteDraft = async () => {
    await handlePublish();
    await handleDeleteDraftPost();
  };

  return (
    <Container>
      <PreviewPublish onClick={handleToggle}>
        {showPublishComponent ? (
          <MdOutlineOpenInNew size={35} />
        ) : (
          <IoCloseCircleOutline size={35} />
        )}
      </PreviewPublish>

      <Wrapper>
        <div className="Editor">
          <ArtificialIntelligenceComponent />
          <input
            className="h1"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TagsInput tags={tags} setTags={setTags} />
          <textarea
            className="h3"
            type="text"
            placeholder="Short Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <ReactQuill
            className="Box-editor"
            value={cont}
            onChange={setCont}
            placeholder="Write your blog here..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ font: ["serif", "sans-serif", "monospace", "Arial"] }],
                [{ size: ["small", false, "large", "huge"] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
                [{ color: [] }],
                [{ align: [] }],
                ["code-block"],
              ],
            }}
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "code-block",
              "link",
              "image",
              "color",
              "align",
            ]}
          />
        </div>

        <PublishWrapper $showPublishComponent={showPublishComponent}>
          <PublishComponent
            title={title}
            desc={desc}
            cont={cont}
            cat={cat}
            tags={tags}
            file={file}
            image={image}
            postId={postId}
            draftId={draftId}
            handleFileChange={handleFileChange}
            handleDeleteDraftPost={handleDeleteDraftPost}
            handleCancel={handleCancel}
            handlePublishAndDeleteDraft={handlePublishAndDeleteDraft}
            setCat={setCat}
            showPublishComponent={showPublishComponent}
            setShowPublishComponent={setShowPublishComponent}
            handleToggle={handleToggle}
            handlePublish={handlePublish}
            metadataPost={metadataPost}
          />
        </PublishWrapper>
      </Wrapper>
    </Container>
  );
};

export default Write;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const PreviewPublish = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 10px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin: 1rem;

  .btn {
    width: 50%;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    background-color: #fff;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    margin: 0 auto;
  }

  .Editor {
    flex: 5;
    margin-left: 5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media only screen and (max-width: 768px) {
      margin-left: 0;
    }

    .Box-editor {
      height: 100%;
      max-width: 100%;
      display: flex;
      flex-direction: column;
    }

    input {
      background-color: transparent;
      border: none;
      margin-top: 0.5rem;
      outline: none;
    }

    textarea {
      background-color: transparent;
      border: none;

      resize: none;
      outline: none;
    }
  }
`;

const PublishWrapper = styled.div`
  flex: 2;
  transition: all 0.3s ease-in-out;
  opacity: ${({ $showPublishComponent }) => ($showPublishComponent ? 1 : 0)};
  max-width: ${({ $showPublishComponent }) =>
    $showPublishComponent ? "100%" : 0};
  overflow: hidden;
`;
