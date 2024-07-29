import Card from "./card";
import styled from "styled-components";
import { Link } from "react-router-dom";

const RenderLocalPosts = ({ localPosts }) => {
  return (
    <LocalPostsContainer>
      {localPosts.length > 0 ? (
        localPosts.map((post) => (
          <Card key={post.id}>
            <LocalPostItem>
              <LocalPostTitle>{post.title}</LocalPostTitle>
              {post.image && <LocalImage src={post.image} alt={post.title} />}
              <LocalDescription>{post.description}</LocalDescription>
            </LocalPostItem>
          </Card>
        ))
      ) : (
        <p>No Local posts to display</p>
      )}
    </LocalPostsContainer>
  );
};

export default RenderLocalPosts;

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

const LocalPostsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 50px;
  gap: 20px;
`;

const LocalPostItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const LocalImage = styled.img`
  width: 300px;
  height: 200px;
  border-radius: 8px;
  margin-right: 15px;
  margin: 0 30px;
`;

const LocalPostTitle = styled(Link)`
  font-size: 1.1em;
  margin: 10px 0;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;

const LocalDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
`;
