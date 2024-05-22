import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { debounced } from "../utils/debounce";
import handleCrossPostToDevTo from "../utils/devToApi";
import TagsInput from "../components/tags";
import save from "../assets/save.png";
import update from "../assets/update.png";

const Write = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const draftParamId = new URLSearchParams(location.search).get("draftId");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState(location?.state?.description || "");
  const [cont, setCont] = useState(location?.state?.content || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(location?.state?.category || "");
  const [tags, setTags] = useState(
    Array.isArray(location?.state?.tags) ? location.state.tags : []
  );
  const [draftId, setDraftId] = useState(draftParamId);
  const [postId, setPostId] = useState(location?.state?.pid || "");
  const [crossPostLoading, setCrossPostLoading] = useState(false);
  const [isCrossPostDevTo, setIsCrossPostDevTo] = useState(false);
  const [devToApiKey, setDevToApiKey] = useState("");

  console.log();

  const handleCrossPost = async () => {
    setCrossPostLoading(true);
    await handleCrossPostToDevTo(title, cont, desc, cat, setCrossPostLoading);
  };

  const handleUpdateDevToToken = async () => {

    
    try {

      const response = await axios.put(`http://localhost:9000/api/v1/user/devToken/${currentUser?.user.id}`, {
        devToToken: devToApiKey,
      }, {
        withCredentials: true,
        credentials: "include"
      });

      console.log(response.data);  



    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const saveDraftAutomatically = async () => {
      if (title && desc && cont && cat && tags && !postId) {
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
  }, [title, desc, cont, cat, tags]);

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
          setFile(postData?.image ? { name: postData.image } : null);
        } else {
          setTitle(draftData[0]?.title || "");
          setDesc(draftData[0]?.description);
          setCont(draftData[0]?.content || "");
          setCat(draftData[0]?.category || "");
          setTags(Array.isArray(draftData[0]?.tags) ? draftData[0].tags : []);
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
      console.log(file);
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
      } else {
        fileUrl = file.name;
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
            <button className="btn" onClick={handleDeleteDraftPost}>
              Delete Draft
            </button>
          )}
          <h5>{file ? `Uploaded: ${file.name}` : "No file selected"}</h5>
          <hr />
          <p>Please toggle the checkbox if you want to publish to Dev.to</p>
          <CrossPosts>
            <input
              type="checkbox"
              id="switch"
              className="toggle"
              checked={isCrossPostDevTo}
              onChange={() => setIsCrossPostDevTo(!isCrossPostDevTo)}
            />
            <label for="switch" className="switch"></label>

            {isCrossPostDevTo && (
              <div>
                <input
                  type="text"
                  placeholder="Enter Dev.to API key"
                  value={devToApiKey}
                  onChange={(e) => setDevToApiKey(e.target.value)}
                />
                <button className="message" title="Save">
                  <img src={save} alt="save" />
                </button>
                <button className="message" title="Update" onClick={handleUpdateDevToToken}>
                  <img src={update} alt="update" />
                </button>
              </div>
            )}
          </CrossPosts>

          {file ? (
            <div className="actions d-flex justify-content-between gap-3">
              <button
                className="btn"
                onClick={handleCrossPost}
                disabled={crossPostLoading}
              >
                {crossPostLoading ? "Cross-Posting..." : "Cross-Post to Dev.to"}
              </button>
              <button className="btn" onClick={handlePublishAndDeleteDraft}>
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
              checked={cat === "Others"}
              value="Others"
              id="Others"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="Others"> Others </label>
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

const CrossPosts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  gap: 0.5rem;
  margin-top: -1rem;

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
