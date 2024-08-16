import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-toastify";

const AiModal = ({ aiAgent, handleClose }) => {
  const { currentUser } = useContext(AuthContext);
  const [numReferences, setNumReferences] = useState(1);
  const [openAiApiKey, setOpenAiApiKey] = useState("");
  const [keyword, setKeyword] = useState("");
  const [blogPost, setBlogPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateBlogPost = async () => {
    setLoading(true);
    setError("");
    setBlogPost("");

    try {
      const response = await axios.post(
        "http://localhost:9000/api/v1/generateBlogPost/generate",
        {
          numReferences,
          openAiApiKey,
          keyword,
        }
      );
      setBlogPost(response.data.blogPost);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(blogPost);
      toast.success("Blog post copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy blog post to clipboard.");
    }
  };

  return (
    <>
      <Modal show={aiAgent} onHide={handleClose} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title className="ms-auto">
            GREAT, THIS IS YOU AI AGENT BASED ON OPEN AI MODEL
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="d-flex flex-column align-items-center">
          <div className="d-flex justify-content-center flex-column align-items-center p-3 bg-light rounded border w-50 ">
            <p>Enter The number of web references (Max 10)</p>
            <input
              className="w-50 mb-3 p-1 rounded border-0 bg-dark text-white"
              type="number"
              min="1"
              max="10"
              onChange={(e) =>
                setNumReferences(
                  Math.min(10, Math.max(1, parseInt(e.target.value)))
                )
              }
              value={numReferences}
            />

            <p>
              Enter Your OpenAi API key{" "}
              <a
                href="https://platform.openai.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenAi API key
              </a>
            </p>
            <input
              className="w-50 mb-3 p-1 rounded border-0 bg-dark text-white"
              type="password"
              onChange={(e) => setOpenAiApiKey(e.target.value)}
              value={openAiApiKey}
            />

            <p>Enter The topic that you want to generate</p>
            <input
              className="w-50 mb-3 p-1 rounded border-0 bg-dark text-white"
              type="text"
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
            />

            <Button
              className="p-2 mb-3"
              variant="primary"
              onClick={handleGenerateBlogPost}
              disabled={loading || !keyword || !openAiApiKey}
            >
              {loading ? "Generating..." : "Generate Blog"}
            </Button>

            {error && <p className="text-danger">{error}</p>}

            <p>
              Don't you know how to use our AI agents yet?{" "}
              <Link to={`/Dashboard/${currentUser.user.name}`}>Click here</Link>{" "}
              to our AiAgents FAQ's{" "}
            </p>
          </div>

          {blogPost && (
            <div className="w-75 mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3>Generated Blog Post:</h3>
                <Button variant="secondary" onClick={copyToClipboard}>
                  Copy to Clipboard
                </Button>
              </div>
              <div className="bg-white p-3 rounded">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={solarizedlight}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {blogPost}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AiModal;
