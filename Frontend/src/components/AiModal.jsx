import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-toastify";
import { FaArrowAltCircleDown } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import save from "../assets/save.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AiModal = ({ aiAgent, handleClose }) => {
  const { currentUser } = useContext(AuthContext);
  const [numReferences, setNumReferences] = useState(1);
  const [openAiApiKey, setOpenAiApiKey] = useState("");
  const [openAiApiKeySaved, setOpenAiApiKeySaved] = useState("");
  const [keyword, setKeyword] = useState("");
  const [blogPost, setBlogPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGenerateBlogPost = async () => {
    setLoading(true);
    setError("");
    setBlogPost("");
    

    try {
      const response = await axios.post(
        "http://localhost:9000/api/v1/generateBlogPost/generate",
        {
          numReferences,
          openAiApiKey: openAiApiKeySaved || openAiApiKey,
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
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleShowCard = () => {
    setShowCard(!showCard);
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

  const handleSaveOpenAiApiKey = async () => {
    try {
      const response = await axios.put(
        `http://localhost:9000/api/v1/user/openAiApiKey/${currentUser?.user.id}`,
        {
          openAiApiKey,
        },
        {
          withCredentials: true,
          credentials: "include",
        }
      );

      setOpenAiApiKeySaved(response.data.openAiApiKey);

      toast.success("OpenAi API key saved successfully!");
    } catch (error) {
      console.error("Error saving OpenAi API key:", error);
      toast.error("Failed to save OpenAi API key.");
    }
  };

  useEffect(() => {
    const getOpenAiApiKey = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/v1/user/openAiApiKey/${currentUser?.user.id}`,
          {
            withCredentials: true,
            credentials: "include",
          }
        );
        setOpenAiApiKeySaved(response.data.openAiApiKey);
      } catch (error) {
        console.error("Error getting OpenAi API key:", error);
      }
    };
    getOpenAiApiKey();
  }, [currentUser?.user.id, showCard]);

  const scrollToAnchor = (e) => {
    e.preventDefault();
    const href = e.target.getAttribute("href");
    if (href.startsWith("#")) {
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <Modal show={aiAgent} onHide={handleClose} fullscreen={true} >
        <Modal.Header closeButton>
          <Modal.Title className="ms-auto">
            GREAT, THIS IS YOU AI AGENT BASED ON OPEN AI MODEL
          </Modal.Title>
        </Modal.Header>

        {!blogPost ? (
          <>
            <CenteredDiv>
              <StyledButton onClick={handleShowCard}>
                <p>Let's Generate A Blog Post</p>
                <AnimatedArrow />
              </StyledButton>
            </CenteredDiv>

            {showCard && (
              <StyledModalBody>
                {!loading && !blogPost ? (
                  <OpenaiCard>
                    <InputGroup>
                      <p>Enter The number of web references (Max 10)</p>
                      <StyledInput
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
                    </InputGroup>

                    <InputGroup>
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
                      <div className="openai-key">
                        <PasswordInputWrapper>
                          <StyledInput
                            type={showPassword ? "text" : "password"}
                            onChange={(e) =>
                              setOpenAiApiKey(e.target.value) ||
                              setOpenAiApiKeySaved(e.target.value)
                            }
                            value={openAiApiKeySaved}
                          />
                          <TogglePasswordButton
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </TogglePasswordButton>
                        </PasswordInputWrapper>

                        <OpenaiButton
                          title="Save"
                          onClick={handleSaveOpenAiApiKey}
                        >
                          <img src={save} alt="save" />
                        </OpenaiButton>
                      </div>
                    </InputGroup>

                    <InputGroup>
                      <p>Enter The topic that you want to generate</p>
                      <StyledInput
                        type="text"
                        onChange={(e) => setKeyword(e.target.value)}
                        value={keyword}
                      />
                    </InputGroup>

                    <StyledGenerateButton
                      variant="primary"
                      onClick={handleGenerateBlogPost}
                      disabled={loading || !keyword || !openAiApiKeySaved}
                    >
                      Generate Blog
                    </StyledGenerateButton>

                    {error && <p className="text-danger">{error}</p>}

                    <p>
                      Don't you know how to use our AI agents yet?{" "}
                      <Link to={`/Dashboard/${currentUser.user.name}`}>
                        Click here
                      </Link>{" "}
                      to our AiAgents FAQ's{" "}
                    </p>
                  </OpenaiCard>
                ) : (
                  <LoadingContainer>
                    <Spinner>
                      <div className="loader"></div>
                    </Spinner>
                    <LoadingMessage>
                      Please wait while your blog post is being generated. This
                      may take a few minutes.
                    </LoadingMessage>
                  </LoadingContainer>
                )}
              </StyledModalBody>
            )}
          </>
        ) : (
          <BlogPostContainer>
            <div className="header">
              <h3>Generated Blog Post:</h3>
              <Button variant="secondary" onClick={copyToClipboard}>
                Copy to Clipboard
              </Button>
            </div>
            <BlogPostContent>
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
                  a: ({ node, ...props }) => {
                    if (props.id) {
                      return <a id={props.id} />;
                    }
                    return <a {...props} onClick={scrollToAnchor} />;
                  },
                }}
              >
                {blogPost}
              </ReactMarkdown>
            </BlogPostContent>
          </BlogPostContainer>
        )}
      </Modal>
    </>
  );
};

export default AiModal;

const moveArrow = keyframes`
  0% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(-10px);
  }
`;
const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const StyledModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const OpenaiCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  height: auto;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 10px;
  background-color: #fff;
  color: #000;
  box-shadow: 0 2px 4px 6px rgba(0.1, 0.1, 0, 0.1);

  .openai-key {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  text-align: center;

  p {
    margin-bottom: 0.5rem;
  }
`;
const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f9fa;
  color: #333;
`;
const StyledGenerateButton = styled(Button)`
  margin-top: 1rem;
  width: 100%;
`;

const BlogPostContainer = styled.div`
  width: auto;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: ${(blogPost) =>
    blogPost ? "none" : "0 2px 4px 6px rgba(0.1, 0.1, 0, 0.1)"};

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
`;

const BlogPostContent = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px 6px rgba(0.1, 0.1, 0, 0.1);
  width: 900px;
  margin: 0 auto;
`;

const AnimatedArrow = styled(FaArrowAltCircleDown)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  animation: ${moveArrow} 2s infinite;
`;

const StyledButton = styled(Button)`
  position: relative;
  padding-bottom: 30px;
  background: linear-gradient(to top, #007adf 0%, #00ecbc 100%);
  border: none;
`;

const OpenaiButton = styled(Button)`
  position: relative;
  background: transparent;
  border: none;
  width: 5%;

  img {
    width: 30px;
    height: 30px;
  }

  &:hover {
    background: transparent;
  }
`;

const Spinner = styled.div`
  margin-top: 1rem;
  .loader {
    width: 70px;
    aspect-ratio: 1;
    background: radial-gradient(farthest-side, #ffa516 90%, #0000) center/16px
        16px,
      radial-gradient(farthest-side, green 90%, #0000) bottom/12px 12px;
    background-repeat: no-repeat;
    animation: l17 1s infinite linear;
    position: relative;
  }
  .loader::before {
    content: "";
    position: absolute;
    width: 8px;
    aspect-ratio: 1;
    inset: auto 0 16px;
    margin: auto;
    background: #ccc;
    border-radius: 50%;
    transform-origin: 50% calc(100% + 10px);
    animation: inherit;
    animation-duration: 0.5s;
  }
  @keyframes l17 {
    100% {
      transform: rotate(1turn);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingMessage = styled.p`
  margin-top: 1rem;
  text-align: center;
  font-size: 1rem;
  color: #666;
`;
