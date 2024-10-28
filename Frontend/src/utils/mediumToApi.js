import axios from 'axios';
import { toast } from 'react-toastify';

const handleCrossPostToMedium = async (
  title,
  content,
  description,
  image,
  category,
  tags,
  mediumToken,
  draftMedium
) => {
  const mediumProxiEndPoint = `${import.meta.env.VITE_API_URI}/medium-proxy`;

  const markdownContent = `# ${description}\n\n${
    import.meta.env.VITE_API_UPLOAD
  }/uploads/${image?.metadata?.name}\n\n${content}`;

  const articleData = {
    title: title,
    content: markdownContent,
    tags: [category, tags.toString()],
    publishStatus: draftMedium ? 'draft' : 'public',
    mediumToken,
  };

  try {
    await axios.post(mediumProxiEndPoint, articleData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    toast.success('Article published to Medium successfully', {
      position: 'bottom-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } catch (error) {
    console.error('Error posting article to Dev.to:', error);
    toast.error('Error posting article to Dev.to');
  }
};

export default handleCrossPostToMedium;
