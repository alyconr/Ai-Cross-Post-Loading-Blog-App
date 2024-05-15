import axios from "axios";
import { toast } from "react-toastify";

const handleCrossPostToDevTo = async (
  title,
  content,
  description,
  category,
  setLoading
) => {
  setLoading(true);

  const devToProxyEndPoint = "http://localhost:9000/api/v1/devto-proxy";

  const markdownContent = `# ${description}\n\n${content}`;

  const articleData = {
    title: title,
    body_markdown: markdownContent,
    published: false,
    tags: [category],
  };

  try {
    const response = await axios.post(devToProxyEndPoint, articleData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Article posted to Dev.to:", response.data);
    toast.success("Article posted to Dev.to successfully");
  } catch (error) {
    console.error("Error posting article to Dev.to:", error);
    toast.error("Error posting article to Dev.to");
  } finally {
    setLoading(false);
  }
};

export default handleCrossPostToDevTo;
