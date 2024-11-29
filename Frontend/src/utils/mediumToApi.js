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

  const markdownContent = `${title}\n\n![${title}](${image})${description}\n\n${content}`;

  const articleData = {
    title: title,
    content: markdownContent,
    canonicalUrl: image,
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
    console.error('Error posting article to Medium:', error);
    toast.error('Error posting article to Medium');
  }
};

export default handleCrossPostToMedium;
