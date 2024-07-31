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

import CustomModal from "../components/Modal";

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

  const [image, setImage] = useState("");

  console.log(file);
  console.log(image);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const { base64String, metadata } = await fileToBase64WithMetadata(
        selectedFile
      );
      if (postId) {
        setImage({ base64String, metadata });
        localStorage.setItem(
          "uploadedImage",
          JSON.stringify({ base64String, metadata })
        );
      } else {
        setFile({ base64String, metadata });
        localStorage.setItem(
          "uploadedFile",
          JSON.stringify({ base64String, metadata })
        );
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

  useEffect(() => {
    const saveDraftAutomatically = async () => {
      if (title && desc && cont && file && cat && tags && !postId) {
        try {
          const endpoint = draftId
            ? `http://localhost:9000/api/v1/draftposts/${draftId}` // Use the existing draftId for updates
            : "http://localhost:9000/api/v1/draftposts"; // Create a new draft only if no draftId is present
          const imageUrl = file?.metadata?.name;

          const response = await axios({
            method: draftId ? "put" : "post",
            url: endpoint,
            data: {
              title,
              description: desc,
              content: cont,
              image: imageUrl,
              date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
              category: cat,
              tags,
            },
            withCredentials: true,
          });

          const newDraftId = response.data.post || draftId;
          setDraftId(newDraftId);

          toast.info("Draft saved successfully", {
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
          console.error("Error saving draft:", err);
          toast.error("Error saving draft");
        }
      }
    };

    const debounceSaveDraft = debounced.debounced(saveDraftAutomatically, 2000);

    // Listen for changes in title, desc, cont, cat, and file
    debounceSaveDraft();

    return () => {
      debounced.cancel();
    };
  }, [title, desc, cont, file?.metadata, cat, tags]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = postId
          ? `http://localhost:9000/api/v1/posts/${postId}`
          : "http://localhost:9000/api/v1/draftposts";
        const response = await axios({
          method: "get",
          url: endpoint,
          withCredentials: true,
        });

        const postData = response.data.post;
        console.log("The Object is: ", postData);

        const draftData = response.data.posts || [];

        console.log(draftData);

        if (postData) {
          setTitle(postData?.title || "");
          setDesc(postData?.description || "");
          setCont(postData?.content || "");
          setCat(postData?.category || "");
          setTags(Array.isArray(postData?.tags) ? postData.tags : []);
          setImage(JSON.parse(postData?.metadata) || "");
        } else {
          setTitle(draftData[0]?.title || "");
          setDesc(draftData[0]?.description || "");
          setCont(draftData[0]?.content || "");
          setCat(draftData[0]?.category || "");
          setTags(Array.isArray(draftData[0]?.tags) ? draftData[0].tags : []);
          //setFile(localStorage.getItem("uploadedFile"));
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

      if (file) {
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

        const fileObject = base64ToFile(
          file.base64String,
          file.metadata.name,
          file.metadata.type
        );

        const formData = new FormData(); //

        formData.set("file", fileObject); // Append the image URL to the formData
        console.log(formData.get("file"));

        const res = await axios.post(
          "http://localhost:9000/api/v1/upload",
          formData
        );
        const filename = res.data;

        fileUrl = `http://localhost:9000/uploads/${filename}`;
        console.log(fileUrl);
      } else {
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

        const imageObject = base64ToFile(
          image.base64String,
          image.metadata.name,
          image.metadata.type
        );

        const formData = new FormData(); //

        formData.set("file", imageObject); // Append the image URL to the formData
        console.log(formData.get("file"));

        const res = await axios.post(
          "http://localhost:9000/api/v1/upload",
          formData
        );
        const filename = res.data;

        fileUrl = `http://localhost:9000/uploads/${filename}`;
        console.log(fileUrl);
      }

      if (location.state?.pid) {
        await axios({
          method: "put",
          url: `http://localhost:9000/api/v1/posts/${location.state.pid}`,
          data: {
            title,
            description: desc,
            content: cont,
            image: fileUrl,
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            category: cat,
            tags,
            metadata: image || file,
          },
          withCredentials: true,
        });
      } else {
        await axios({
          method: "post",
          url: "http://localhost:9000/api/v1/posts",
          data: {
            title,
            description: desc,
            content: cont,
            image: fileUrl,
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            category: cat,
            tags,
            metadata: image || file,
          },
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
      <PreviewPublish>
        <MdOutlineOpenInNew size={35} />
        <IoCloseCircleOutline size={35} />
      </PreviewPublish>

      <Wrapper>
        <div className="Editor">
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
        />
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
      height: auto;
      max-width: 100%;
      display: flex;
      flex-direction: column;
    }

    input {
      padding: 0.5rem;
      background-color: transparent;
      border: none;
      margin-top: 1rem;
      outline: none;
    }

    textarea {
      padding: 0.5rem;
      background-color: transparent;
      border: none;

      resize: none;
      outline: none;
    }
  }
`;
