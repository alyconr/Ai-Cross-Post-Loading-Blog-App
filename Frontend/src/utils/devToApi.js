import axios from "axios";
import { toast } from "react-toastify";

const handleCrossPostToDevTo = async (
  title,
  content,
  description,
  image,
  category,
  tags,
  devToken,
  draftDevto
) => {
  const devToProxyEndPoint = "http://localhost:9000/api/v1/devto-proxy";

  const markdownContent = `# ${description}\n\n${content}`;

  const articleData = {
    title: title,
    body_markdown: markdownContent,
    published: draftDevto ? true : false,
    main_image: `http://localhost:9000/uploads/${image?.metadata?.name}`,
    tags: [category, tags],
    devToken,
  };
  console.log(articleData);

  try {
    await axios.post(devToProxyEndPoint, articleData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    toast.success("Article posted to Dev.to successfully", {
      position: "bottom-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } catch (error) {
    console.error("Error posting article to Dev.to:", error);
    toast.error("Error posting article to Dev.to");
  }
};

export default handleCrossPostToDevTo;
