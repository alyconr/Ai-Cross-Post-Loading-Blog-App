import styled from "styled-components";
import { BsPostcardHeartFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const MenuLeft = ({ category }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios(
          `http://localhost:9000/api/v1/posts/?category=${category}`
        );
        const reverse = res.data.posts.reverse();

        setPosts(reverse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [category]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  return (
    <Wrapper>
      <h1>
        Posts you may like
        <BsPostcardHeartFill
          color={"#6A072D"}
          size={40}
          style={{ marginLeft: "1rem" }}
        />
      </h1>

      {Array.isArray(posts) &&
        posts.map((post) => (
          <div className="post" key={post.id}>
            <img
              className="postImg"
              src={post.image}
              alt="post"
            />
            <div className="postInfo">
              <h2 className="postTitle">{post.title}</h2>
              <p>{getText(post.description)}</p>
              <Link
                to={`/singlepost/${post.id}/title=${encodeURIComponent(
                  post.title.replace(/ /g, "-")
                )}`}
              >
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
    </Wrapper>
  );
};

export default MenuLeft;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 1rem 1.5rem;
    color: #1a0a06;
    text-align: justify;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: bolder;
  }
  .post {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1.5rem;
  }

  .postImg {
    width: 100%;
    height: 300px;
    border-radius: 10px;
  }

  .postInfo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .postTitle {
    font-size: 1.5rem;
    font-weight: 500;
  }

  button {
    border: none;
    border-radius: 5px;
    background-color: #3d84f7;
    cursor: pointer;
    color: white;
    font-weight: 500;
    width: 25%;
    padding: 0.5rem;
  }
`;
