import axios from 'axios';
import { toast } from 'react-toastify';

const handleCrossPostToHashnode = async (
  title,
  content,
  description,
  image,
  tags,
  hashnodeToken,
  hashnodePublicationId,
  draftHashnode
) => {
  const hashnodeProxyEndPoint = `${
    import.meta.env.VITE_API_URI
  }/hashnode-proxy`;

  const markdownContent = `${description}\n\n${content}`;

  const articleData = {
    publicationId: hashnodePublicationId,
    title: title,
    contentMarkdown: markdownContent,
    coverImageOptions: {
      coverImageURL: image,
    },
    tags:
      Array.isArray(tags) &&
      tags.map((tag) => ({
        name: tag.toString(),
        slug: tag.toString().toLowerCase().replace(/ /g, '-'),
      })),
    hashnodeApiKey: hashnodeToken,
    draft: draftHashnode ? true : false,
  };

  try {
    await axios.post(hashnodeProxyEndPoint, articleData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    toast.success(' Article published to Hashnode successfully', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  } catch (error) {
    console.error('Error publishing article:', error);
  }
};

export default handleCrossPostToHashnode;
