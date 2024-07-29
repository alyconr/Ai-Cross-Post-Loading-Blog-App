import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import useFetch from "../utils/useFetch";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Bookmarks = () => {
  const category = useLocation().search;
  console.log(category);

  const { currentUser } = useContext(AuthContext);

  const currentUserId = currentUser?.user?.id;

  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const getBookmarks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/v1/bookmarks/${currentUserId} `
        );
        setBookmarks(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getBookmarks();
  }, [currentUserId]);

  return (
    <Container>
      <h1>Reading List</h1>
      <BookmarksContainer>
        <MenuSide>
          <Link className="link">#Web Development</Link>
          <Link className="link">#Cloud Computing</Link>
          <Link className="link">#DevOps</Link>
          <Link className="link">#Security</Link>
          <Link className="link">#Linux</Link>
        </MenuSide>
        <Post>
          {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
            bookmarks.map((post) => (
              <Posts key={post.id}>
                <img src={post.image} alt={post.title} />
                <div className="Content">
                  <PostLink
                    to={`/singlepost/${post.id}/title=${encodeURIComponent(
                      post.title.replace(/ /g, "-")
                    )}`}
                  >
                    <h2>{post.title}</h2>
                  </PostLink>
                  <h5>{post.description}</h5>
                  <Button>
                    <Link
                      className="read-more"
                      to={`/singlepost/${post.id}/title=${encodeURIComponent(
                        post.title.replace(/ /g, "-")
                      )}`}
                    >
                      Read More
                    </Link>
                  </Button>
                </div>
              </Posts>
            ))
          ) : (
            <h1>No posts bookmarked</h1>
          )}
        </Post>
      </BookmarksContainer>
    </Container>
  );
};

export default Bookmarks;

const Container = styled.div`
  h1 {
    width: 15%;
    font-size: 1.5rem;
    font-weight: 500;
    padding: 1rem 1.5rem;
    margin: 1rem 1.5rem;
    color: #fff;
    text-align: center;
    background: radial-gradient(
      circle,
      rgba(63, 94, 251, 1) 0%,
      rgba(29, 168, 204, 1) 100%
    );
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    h1 {
      width: 90%;
    }
  }

  @media (max-width: 432px) {
    h1 {
      width: 90%;
    }
  }

  @media (max-width: 320px) {
    h1 {
      width: 90%;
    }
  }
`;
const BookmarksContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #f8f8f8;
  border-radius: 5px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const MenuSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  border-radius: 5px;
  padding: 20px;

  .link {
    font-size: 1.2rem;
    font-weight: 500;
    width: 100%;
    margin: 5px 0;
    padding: 5px;
    color: #fff;
    text-align: justify;
    text-decoration: none;
    background-image: linear-gradient(
      45deg,
      hsl(240deg 100% 20%) 0%,
      hsl(289deg 100% 18%) 11%,
      hsl(317deg 100% 21%) 22%,
      hsl(331deg 100% 25%) 33%,
      hsl(339deg 100% 27%) 44%,
      hsl(1deg 60% 35%) 56%,
      hsl(19deg 66% 34%) 67%,
      hsl(31deg 66% 34%) 78%,
      hsl(42deg 55% 35%) 89%,
      hsl(55deg 39% 37%) 100%
    );
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    gap: 5px;
    justify-content: center;

    .link {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .link {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 320px) {
    .link {
      font-size: 0.7rem;
    }
  }
`;

const Post = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  border-radius: 5px;
  padding: 10px;
  gap: 20px;

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }

  @media (max-width: 320px) {
    width: 100%;
  }
`;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 5px;
  padding: 20px;
  gap: 20px;

  img {
    width: 100%;
    height: 300px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    display: block;
  }

  .Content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 5px;
    gap: 20px;
  }

  .read-more {
    width: 100%;
    padding: 0.5rem 0;
    border: none;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
`;

const PostLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: bold;
  font-size: 20px;
`;

const Button = styled.button`
  background: linear-gradient(
    45deg,
    hsl(240deg 100% 20%) 0%,
    hsl(289deg 100% 18%) 11%,
    hsl(317deg 100% 21%) 22%,
    hsl(331deg 100% 25%) 33%,
    hsl(339deg 100% 27%) 44%,
    hsl(1deg 60% 35%) 56%,
    hsl(19deg 66% 34%) 67%,
    hsl(31deg 66% 34%) 78%,
    hsl(42deg 55% 35%) 89%,
    hsl(55deg 39% 37%) 100%
  );
  border: none;
  width: auto;
  padding: 10px 20px;
`;
