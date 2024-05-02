import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import useFetch from "../utils/useFetch";

const Userposts = () => {
  const location = useLocation();

  const username = location.pathname.split("/")[2];

  const {
    data: posts,
    loading,
    error,
  } = useFetch(`http://localhost:9000/api/v1/user/posts/${username}`);

  return (
    <Wrapper>
      {error && <div>{error}</div>}
      {loading ? (
        <Loader>
          <div className="loader">&#128238;</div>
        </Loader>
      ) : (
        <>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <Post key={post.id}>
                <img
                  src={`http://localhost:9000/uploads/${post.image}`}
                  alt={post.title}
                />
                <div className="Content">
                  <PostLink to={`/singlepost/${post.id}`}>
                    <h1>{post.title}</h1>
                  </PostLink>
                  <h3>{post.description}</h3>
                  <Link to={`/singlepost/${post.id}`}>
                    {" "}
                    <Button>Read More</Button>
                  </Link>
                </div>
              </Post>
            ))
          ) : (
            <NoPostsMessage>
              No posts yet, be the first to write one.
            </NoPostsMessage>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default Userposts;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Loader = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 50px;

  .loader {
    width: fit-content;
    font-weight: bold;
    font-family: monospace;
    font-size: 30px;
    background: radial-gradient(circle closest-side, #000 94%, #0000)
      right/calc(200% - 1em) 100%;
    animation: l24 1s infinite alternate linear;
  }

  .loader::before {
    content: "Loading Posts...";
    line-height: 1em;
    color: #0000;
    background: inherit;
    background-image: radial-gradient(circle closest-side, #fff 94%, #000);
    -webkit-background-clip: text;
    background-clip: text;
  }

  @keyframes l24 {
    100% {
      background-position: left;
    }
  }
`;

const Post = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  margin: 50px auto 0;
  gap: 50px;

  .Content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 80%;
    gap: 10px;
  }

  img {
    width: 40%;
    height: 300px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  h3 {
    font-size: 20px;
    line-height: 1.5;
    margin: 0;
    font-weight: 400;
    color: #555;
    text-align: justify;
    text-justify: inter-word;
  }

  &:nth-child(even) {
    flex-direction: row-reverse;
  }

  .Content {
    position: relative;
    z-index: 1;
    flex: 3;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #070636;
  }
`;

const PostLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: bold;
  font-size: 20px;
`;
const NoPostsMessage = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 50px;
`;
