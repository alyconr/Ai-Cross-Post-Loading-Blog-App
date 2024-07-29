import Card from "./card";
import styled from "styled-components";
import { Link } from "react-router-dom";

const RenderDevtoPosts = ({ devtoPosts }) => {
    return (
      <DevtoPostsContainer>
        {devtoPosts.length > 0 ? (
          devtoPosts.map((post) => (
            <Card key={post.id}>
              <DevtoPostItem>
                <DevtoPostTitle>{post.title}</DevtoPostTitle>
                {post.cover_image && (
                  <DevtoImage src={post.cover_image} alt={post.title} />
                )}
                <DevtoDescription>{post.description}</DevtoDescription>
                <Button>
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    Read on Dev.to
                  </a>
                </Button>
              </DevtoPostItem>
            </Card>
          ))
        ) : (
          <p>No Dev.to posts to display</p>
        )}
      </DevtoPostsContainer>
    );
};
  
export default RenderDevtoPosts;

const DevtoPostsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 50px;
  gap: 20px;
`;

const DevtoPostItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const DevtoImage = styled.img`
  width: 300px;
  height: 200px;
  border-radius: 8px;
  margin-right: 15px;
  margin: 0 30px;
`;

const DevtoPostTitle = styled(Link)`
  font-size: 1.1em;
  margin: 10px 0;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;

const DevtoDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
`;

const Button = styled.button`
  background: radial-gradient(
    circle at 12.3% 19.3%,
    rgb(85, 88, 218) 0%,
    rgb(95, 209, 249) 100.2%
  );
  border: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 10px 20px;

  a {
    color: white;
    text-decoration: none;
  }
`;