import axios from 'axios';
import { toast } from 'react-toastify';

const handleCrossPostToHashnode = async (
  title,
  content,
  description,
  tags,
  hashnodeToken,
  hashnodePublicationId,
  draftHashnode
) => {
  const hashnodeProxyEndPoint = `${
    import.meta.env.VITE_API_URI
  }/hashnode-proxy`;

  const markdownContent = `# ${content}`;

  console.log(hashnodeToken);
  const articleData = {
    publicationId: hashnodePublicationId,
    title: title,
    subtitle: description,
    contentMarkdown: markdownContent,
    coverImageOptions: {
      coverImageURL:
        'https://caracoltv.brightspotcdn.com/dims4/default/13a675b/2147483647/strip/true/crop/1000x666+0+0/resize/1000x666!/format/webp/quality/90/?url=http%3A%2F%2Fcaracol-brightspot.s3.us-west-2.amazonaws.com%2Fcb%2F07%2Fd8719fa241a89a444d4a24e91d0d%2Fluis-diaz-liverpool-premier-league-west-ham.jpg',
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
  console.log('Article data:', articleData);
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
