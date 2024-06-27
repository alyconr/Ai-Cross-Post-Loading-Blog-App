import axios from "axios";
import { toast } from "react-toastify";

const handleCrossPostToHashnode = async (
  title,
  content,
  description,
  image,
  category,
  tags,
  hashnodeToken,
  hashnodePublicationId
) => {
  const hashnodeProxyEndPoint = "http://localhost:9000/api/v1/hashnode-proxy";

  const markdownContent = `# ${content}`;

  const articleData = {
    publicationId: hashnodePublicationId,
    title: title,
    subtitle: description,
    contentMarkdown: markdownContent,
    coverImageOptions: {
      coverImageURL:
        "https://caracoltv.brightspotcdn.com/dims4/default/13a675b/2147483647/strip/true/crop/1000x666+0+0/resize/1000x666!/format/webp/quality/90/?url=http%3A%2F%2Fcaracol-brightspot.s3.us-west-2.amazonaws.com%2Fcb%2F07%2Fd8719fa241a89a444d4a24e91d0d%2Fluis-diaz-liverpool-premier-league-west-ham.jpg",
    },
    tags: tags.map((tag) => ({
      name: tag.toString(),
      slug: tag.toString().toLowerCase().replace(/ /g, "-"),
    })),
    hashnodeApiKey: hashnodeToken,
  };

  try {
    const response = await axios.post(hashnodeProxyEndPoint, articleData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Article published successfully:", response.data);
    toast.success("Article published successfully", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } catch (error) {
    console.error("Error publishing article:", error);
  }
};

export default handleCrossPostToHashnode;
