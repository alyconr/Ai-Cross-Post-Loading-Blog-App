import styled from "styled-components";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { debounced } from "../utils/debounce";

const Write = () => {
  const location = useLocation();

  console.log(location);

  const navigate = useNavigate();
  const draftParamId = new URLSearchParams(location.search).get("draftId");

  const [title, setTitle] = useState(location?.state?.title || "");
  const [desc, setDesc] = useState(location?.state?.description || "");
  const [cont, setCont] = useState(location?.state?.content || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(location?.state?.category || "");
  const [draftId, setDraftId] = useState(draftParamId);
  const [postId, setPostId] = useState(location?.state?.pid || "");

  useEffect(() => {
    const saveDraftAutomatically = async () => {
      if (title && desc && cont && cat && !postId) {
        try {
          const endpoint = draftId
            ? `http://localhost:9000/api/v1/draftposts/${draftId}` // Use the existing draftId for updates
            : "http://localhost:9000/api/v1/draftposts"; // Create a new draft only if no draftId is present

          const response = await axios({
            method: draftId ? "put" : "post",
            url: endpoint,
            data: {
              title,
              description: desc,
              content: cont,
              image: file ? file.name : "",
              date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
              category: cat,
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
  }, [title, desc, cont, cat]);

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
          setFile(postData?.image ? { name: postData.image } : null);
        } else {
          setTitle(draftData[0]?.title || "");
          setDesc(draftData[0]?.description);
          setCont(draftData[0]?.content || "");
          setCat(draftData[0]?.category || "");
          setFile(draftData[0]?.image ? { name: draftData[0].image } : null);
        }
      } catch (err) {
        console.log(err);
      }
    };

    // Only fetch draft data when the component mounts

    fetchData();
  }, [draftId]);

  const handleDeleteDraftPost = async () => {
    if (!postId) {
      try {
        // Delete the draftId from localStorage
        localStorage.removeItem("draftId");

        // Set the state to null or an appropriate value
        setDraftId(null);

        await axios.delete(`http://localhost:9000/api/v1/draftposts`, {
          withCredentials: true,
        });
        setTitle("");
        setDesc("");
        setCont("");
        navigate("/");
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

  const handlePublish = async () => {
    if (!title || !desc || !cont || !cat) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      let fileUrl = "";
      console.log(file)
      if (!file) {
        console.log(file);
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

        const formData = new FormData();
        formData.set("file", file);
        console.log(formData.get("file"));

        const res = await axios.post(
          "http://localhost:9000/api/v1/upload",
          formData
        );
        const filename = res.data;

        fileUrl = filename;

        console.log(fileUrl);
      } else  {
        fileUrl = file.name
      }

      const method = location.state.pid ? "put" : "post";
      const url = location.state.pid
        ? `http://localhost:9000/api/v1/posts/${location.state.pid}`
        : "http://localhost:9000/api/v1/posts";

      await axios({
        method: method,
        url: url,
        data: {
          title,
          description: desc,
          content: cont,
          image: fileUrl,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          category: cat,
        },
        withCredentials: true,
      });

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
      console.log(err);
      toast.error("Error uploading image or publishing post");
    }
  };

  const handlePublishAndDeleteDraft = async () => {
    await handlePublish();
    await handleDeleteDraftPost();
  };

  return (
    <Wrapper>
      <div className="Editor">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
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
      <div className="Preview">
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
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="input-file" htmlFor="file">
            Upload Image
          </label>
          {!postId && (
            <button onClick={handleDeleteDraftPost}>Delete Draft</button>
          )}
          <h5>{file ? `Uploaded: ${file.name}` : "No file selected"}</h5>
          {file ? (
            <div className="actions">
              <button onClick={handlePublishAndDeleteDraft}>Publish</button>
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
        </div>
      </div>
    </Wrapper>
  );
};

export default Write;

const Wrapper = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1rem;

  button {
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
      height: 600px;
      max-width: 100%;
      border: 1px solid #ccc;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: hidden;
      resize: vertical;
    }

    input {
      padding: 0.5rem;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid #ccc;
      margin-top: 1rem;
      outline: none;
    }

    textarea {
      padding: 0.5rem;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid #ccc;
      resize: none;
      outline: none;
    }
  }

  .Preview {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .box-1,
    .box-2 {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 1rem;
      flex: 1;
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
    }

    .actions {
      display: flex;
      justify-content: space-between;

      button {
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
