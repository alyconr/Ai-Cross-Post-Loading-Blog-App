import axios from "axios";
import { toast } from "react-toastify";

const handleCrossPostToDevTo = async (
  title,
  content,
  description,
  image,
  category,
  tags,
  devToken
) => {
  const devToProxyEndPoint = "http://localhost:9000/api/v1/devto-proxy";

  const markdownContent = `# ${description}\n\n${content}`;

  const articleData = {
    title: title,
    body_markdown: markdownContent,
    published: false,
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

    toast.success("Article posted to Dev.to successfully");
  } catch (error) {
    console.error("Error posting article to Dev.to:", error);
    toast.error("Error posting article to Dev.to");
  }
};

export default handleCrossPostToDevTo;
