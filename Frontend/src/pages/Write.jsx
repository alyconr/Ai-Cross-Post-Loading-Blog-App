import styled from 'styled-components';
import { useEffect, useState, useRef, useCallback } from 'react';
import 'react-quill/dist/quill.snow.css';
import '@mdxeditor/editor/style.css';
import { codeMirrorPlugin } from '@mdxeditor/editor';
import {
  MDXEditor,
  BlockTypeSelect,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  headingsPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  listsPlugin,
  codeBlockPlugin,
  CodeToggle,
  InsertCodeBlock,
  InsertTable,
  InsertImage,
  ListsToggle,
  Separator,
  CreateLink,
  linkDialogPlugin,
  InsertThematicBreak,
  thematicBreakPlugin,
  quotePlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
} from '@mdxeditor/editor';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { debounced } from '../utils/debounce';
import TagsInput from '../components/tags';
import PublishComponent from '../components/PublishComponent';

import { IoCloseCircleOutline } from 'react-icons/io5';
import { MdPostAdd } from 'react-icons/md';
import {
  fileToBase64WithMetadata,
  base64ToFile,
} from '../utils/uploadImagesUtils';
import ArtificialIntelligenceComponent from '../components/ArtificialIntelligence';

const Write = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const draftParamId = new URLSearchParams(location.search).get('draftId');

  const [title, setTitle] = useState(location?.state?.title || '');
  const [desc, setDesc] = useState(location?.state?.description || '');
  const [cont, setCont] = useState(location?.state?.content || '');
  const [file, setFile] = useState('');
  const [cat, setCat] = useState(location?.state?.category || '');
  const [tags, setTags] = useState(
    Array.isArray(location?.state?.tags) ? location.state.tags : []
  );
  const [draftId, setDraftId] = useState(draftParamId);
  const [postId] = useState(location?.state?.pid || '');
  const [metadataPost, setMetadataPost] = useState();
  const [initialMarkdown, setInitialMarkdown] = useState('');
  const [setPost] = useState('');
  const [fileAwsS3, setFileAwsS3] = useState('');
  const [image, setImage] = useState('');
  console.log(metadataPost);
  console.log(file.metadata?.name);
  console.log(image);
  const [showPublishComponent, setShowPublishComponent] = useState(true);

  const editorRef = useRef(null);

  const [imageState, setImageState] = useState({
    fileData: null,
    awsUrl: '',
    metadata: null,
  });

  const saveDraftAndPostAutomatically = useCallback(async () => {
    if (
      title &&
      desc &&
      cont &&
      cat &&
      tags &&
      (imageState.fileData || imageState.awsUrl)
    ) {
      try {
        let endpoint;
        let method;

        if (postId) {
          endpoint = `${import.meta.env.VITE_API_URI}/posts/${
            location.state.pid
          }`;
          method = 'put';
        } else if (draftId) {
          endpoint = `${import.meta.env.VITE_API_URI}/draftposts/${draftId}`;
          method = 'put';
        } else {
          endpoint = `${import.meta.env.VITE_API_URI}/draftposts`;
          method = 'post';
        }

        const imageUrl =
          imageState.awsUrl || imageState.fileData?.metadata?.name;

        const response = await axios({
          method: method,
          url: endpoint,
          data: {
            title,
            description: desc,
            content: cont,
            image: imageUrl,
            date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            category: cat,
            tags,
            metadata: imageState.metadata || imageState.fileData?.metadata,
          },
          withCredentials: true,
        });

        if (!postId && !draftId) {
          const newDraftId = response.data.post;
          setDraftId(newDraftId);
        }

        toast.info(
          postId ? 'Post updated successfully' : 'Draft saved successfully',
          {
            position: 'bottom-center',
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          }
        );
      } catch (err) {
        console.error('Error saving draft:', err);
        toast.error('Error saving draft. Please try again.');
      }
    }
  }, [
    title,
    desc,
    cont,
    cat,
    tags,
    imageState,
    postId,
    draftId,
    location?.state?.pid,
  ]);
  const handleEditorChange = (content) => {
    setCont(content);
    if (!initialMarkdown) {
      setInitialMarkdown(content);
    }
    saveDraftAndPostAutomatically();
  };

  const handleToggle = (event) => {
    event.preventDefault();
    setShowPublishComponent(!showPublishComponent);
  };
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const { base64String, metadata } = await fileToBase64WithMetadata(
          selectedFile
        );
        const fileData = { base64String, metadata };

        setImageState({
          fileData,
          awsUrl: '',
          metadata,
        });

        if (postId) {
          setImage(fileData);
          localStorage.setItem('uploadedImage', JSON.stringify(fileData));
        } else {
          setFile(fileData);
          localStorage.setItem('uploadedFile', JSON.stringify(fileData));
        }
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('Error processing file. Please try again.');
      }
    }
  };

  useEffect(() => {
    const savedFile = localStorage.getItem('uploadedFile');
    if (savedFile && draftId) {
      setFile(JSON.parse(savedFile));
    } else {
      const savedImage = localStorage.getItem('uploadedImage');
      if (savedImage) {
        setImage(JSON.parse(savedImage));
      }
    }
  }, [draftId]);

  useEffect(() => {
    // First check if all required fields are present
    const areAllFieldsComplete =
      title && desc && cont && cat && tags && (file || image);

    if (areAllFieldsComplete) {
      const debounceSaveDraft = debounced.debounced(
        saveDraftAndPostAutomatically,
        2000
      );

      debounceSaveDraft();

      return () => {
        debounced.cancel();
      };
    }
  }, [
    title,
    desc,
    cont,
    cat,
    tags,
    file,
    image,
    saveDraftAndPostAutomatically,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint;
        if (postId) {
          endpoint = `${import.meta.env.VITE_API_URI}/posts/${postId}`;
        } else if (draftId) {
          endpoint = `${import.meta.env.VITE_API_URI}/draftposts/${draftId}`;
        } else {
          return;
        }

        const response = await axios({
          method: 'get',
          url: endpoint,
          withCredentials: true,
        });

        const data = response.data;
        setPost(response.data);

        if (data.post) {
          const postData = data.post;
          setTitle(postData?.title || '');
          setDesc(postData?.description || '');
          setCont(postData?.content || '');
          setCat(postData?.category || '');
          setTags(Array.isArray(postData?.tags) ? postData.tags : []);

          // New image state handling
          setImageState({
            fileData: postData?.metadata ? JSON.parse(postData.metadata) : null,
            awsUrl: postData?.image || '',
            metadata: postData?.metadata ? JSON.parse(postData.metadata) : null,
          });

          setMetadataPost(
            postData?.metadata ? JSON.parse(postData.metadata) : ''
          );
          setFileAwsS3(postData?.image);
        } else if (data.posts && data.posts.length > 0) {
          const draftData = data.posts[0];
          setTitle(draftData?.title || '');
          setDesc(draftData?.description || '');
          setCont(draftData?.content || '');
          setCat(draftData?.category || '');
          setTags(Array.isArray(draftData?.tags) ? draftData.tags : []);

          // New draft image state handling
          setImageState({
            fileData: draftData?.metadata
              ? JSON.parse(draftData.metadata)
              : null,
            awsUrl: draftData?.image || '',
            metadata: draftData?.metadata
              ? JSON.parse(draftData.metadata)
              : null,
          });

          setImage(draftData?.metadata ? JSON.parse(draftData.metadata) : '');
          setFileAwsS3(draftData?.image);
        }

        // Restore image from localStorage if available
        const savedFile = localStorage.getItem('uploadedFile');
        const savedImage = localStorage.getItem('uploadedImage');

        if (savedFile && draftId) {
          const parsedFile = JSON.parse(savedFile);
          setImageState((prev) => ({
            ...prev,
            fileData: parsedFile,
            metadata: parsedFile.metadata,
          }));
        } else if (savedImage) {
          const parsedImage = JSON.parse(savedImage);
          setImageState((prev) => ({
            ...prev,
            fileData: parsedImage,
            metadata: parsedImage.metadata,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [draftId, postId, setPost]);

  const handleDeleteDraftPost = async () => {
    if (postId) {
      try {
        // Delete the draftId from localStorage
        localStorage.removeItem('draftId');
        localStorage.removeItem('uploadedFile');
        localStorage.removeItem('uploadedImage');
        // Set the state to null or an appropriate value

        await axios.delete(`${import.meta.env.VITE_API_URI}/draftposts`, {
          withCredentials: true,
        });
        setTitle('');
        setDesc('');
        setCont('');
        setDesc(' ');
        setFile('');
        setImage('');
        setDraftId('');
        navigate('/');
        toast.info('Draft deleted successfully', {
          position: 'bottom-right',
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handlePublish = async () => {
    if (!title || !desc || !cont || !cat) {
      toast.error('Please fill all the fields');
      return;
    }

    try {
      let fileUrl = '';

      if (file || image) {
        toast.info('Uploading image...', {
          position: 'bottom-right',
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });

        let fileObject;

        if (file && file.base64String) {
          fileObject = base64ToFile(
            file.base64String,
            file.metadata?.name || 'image.jpg',
            file.metadata?.type || 'image/jpeg'
          );
        } else if (image && image.base64String) {
          fileObject = base64ToFile(
            image.base64String,
            image.metadata?.name || 'image.jpg',
            image.metadata?.type || 'image/jpeg'
          );
        } else if (image instanceof File) {
          fileObject = image;
        }

        if (fileObject) {
          const formData = new FormData();
          formData.set('file', fileObject);

          const res = await axios.post(
            `${import.meta.env.VITE_API_URI}/upload`,
            formData
          );
          const filename = res.data.url;

          console.log(filename);

          fileUrl = `${filename}`;
        }
      }

      const metadata = localStorage.getItem('uploadedImage')
        ? JSON.parse(localStorage.getItem('uploadedImage'))
        : null;

      const postData = {
        title,
        description: desc,
        content: cont,
        image: fileUrl,
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        category: cat,
        tags,
        metadata,
      };

      if (location.state?.pid) {
        await axios({
          method: 'put',
          url: `${import.meta.env.VITE_API_URI}/posts/${location.state.pid}`,
          data: postData,
          withCredentials: true,
        });
      } else {
        await axios({
          method: 'post',
          url: `${import.meta.env.VITE_API_URI}/posts`,
          data: postData,
          withCredentials: true,
        });
      }

      toast.success('Post published successfully', {
        position: 'bottom-right',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Error uploading image or publishing post');
    }
  };

  const handlePublishAndDeleteDraft = async () => {
    await handlePublish();
    await handleDeleteDraftPost();
  };

  const imageUploadHandler = async (image) => {
    try {
      if (image instanceof File) {
        const formData = new FormData();
        formData.append('file', image);

        // Upload to your server
        const response = await axios.post(
          `${import.meta.env.VITE_API_URI}/upload`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // Show success message
        toast.success('Image uploaded successfully', {
          position: 'bottom-right',
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });

        // Return the URL from the response
        return response.data.url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image. Please try again.');
      throw error;
    }
  };

  return (
    <Container>
      <PreviewPublish onClick={handleToggle}>
        {showPublishComponent ? (
          <MdPostAdd size={50} />
        ) : (
          <IoCloseCircleOutline size={50} />
        )}
      </PreviewPublish>

      <Wrapper>
        <EditorWrapper>
          <StickyEditor>
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

            <MDXEditor
              ref={editorRef}
              markdown={cont}
              onChange={handleEditorChange}
              plugins={[
                headingsPlugin(),
                linkPlugin(),
                markdownShortcutPlugin(),
                listsPlugin(),
                thematicBreakPlugin(),
                linkDialogPlugin(),
                codeBlockPlugin({
                  defaultCodeBlockLanguage: 'javascript',
                }),
                imagePlugin({
                  imageUploadHandler,
                  defaultAttributes: {
                    className: 'uploaded-image',
                    loading: 'lazy',
                  },
                }),
                tablePlugin(),
                thematicBreakPlugin(),
                quotePlugin(),
                diffSourcePlugin({
                  diffMarkdown: initialMarkdown,
                  viewMode: 'rich-text',
                }),
                codeBlockPlugin({
                  defaultCodeBlockLanguage: 'js',
                  defaultCodeBlockTheme: 'dark',
                  codeBlockLanguages: {
                    javascript: 'JavaScript',
                    python: 'Python',
                    php: 'PHP',
                    css: 'CSS',
                    shell: 'Shell',
                    bash: 'Bash',
                    html: 'HTML',
                    json: 'JSON',
                    nginx: 'Nginx',
                    dockerfile: 'Dockerfile',
                    yaml: 'Yaml',
                    csharp: 'C#',
                    makefile: 'Makefile',
                  },
                }),
                codeMirrorPlugin({
                  codeBlockLanguages: {
                    javascript: 'javascript',
                    python: 'python',
                    php: 'php',
                    css: 'css',
                    html: 'html',
                    json: 'json',
                    shell: 'shell',
                    bash: 'bash',
                    nginx: 'nginx',
                    Dockerfile: 'Dockerfile',
                    yaml: 'yaml',
                    csharp: 'csharp',
                    makefile: 'makefile',
                  },
                }),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      {' '}
                      <DiffSourceToggleWrapper>
                        <UndoRedo />
                        <BlockTypeSelect />
                        <BoldItalicUnderlineToggles />
                        <InsertTable />
                        <InsertImage />
                        <InsertThematicBreak />
                        <InsertCodeBlock />
                        <CodeToggle />
                        <ListsToggle />
                        <CreateLink />
                        <Separator />
                      </DiffSourceToggleWrapper>
                    </>
                  ),
                }),
              ]}
              contentEditableClassName="mdx-editor"
            />
          </StickyEditor>
        </EditorWrapper>

        <PublishWrapper $showPublishComponent={!showPublishComponent}>
          <PublishComponent
            title={title}
            desc={desc}
            cont={cont}
            cat={cat}
            tags={tags}
            file={file}
            fileAwsS3={fileAwsS3}
            image={image}
            imageState={imageState}
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
  height: 100vh;
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
  height: calc(100vh - 70px); // Adjust based on the height of PreviewPublish
  overflow: hidden;

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    background-color: #fff;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    width: 50%;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }
`;
const EditorWrapper = styled.div`
  flex: 5;
  overflow-y: auto;
  padding: 0 1rem;

  @media only screen and (max-width: 768px) {
    flex: none;
    height: auto;
  }
`;

const StickyEditor = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;

  input,
  textarea {
    background-color: transparent;
    border: none;
    outline: none;
  }

  textarea {
    resize: none;
  }

  .mdx-editor {
    min-height: 300px; // Adjust as needed
  }

  @media only screen and (max-width: 768px) {
    position: static;
  }
`;

const PublishWrapper = styled.div`
  flex: 2;
  transition: all 0.3s ease-in-out;
  opacity: ${({ $showPublishComponent }) => ($showPublishComponent ? 1 : 0)};
  max-width: ${({ $showPublishComponent }) =>
    $showPublishComponent ? '100%' : 0};
  overflow: hidden;
  overflow-y: auto;
  height: 100%;
`;
