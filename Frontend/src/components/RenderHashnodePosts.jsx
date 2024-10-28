import Card from "./card";
import styled from "styled-components";
import { Link } from "react-router-dom";

const renderHashNodePosts = ({ hashNodePosts }) => {
  return (
    <HashNodePostsContainer>
      {hashNodePosts.length > 0 ? (
        hashNodePosts.map((post) => (
          <Card key={post.node.id}>
            <HashNodePostItem>
              <HashNodePostTitle>{post.node.title}</HashNodePostTitle>
              {post.node.coverImage && (
                <HashNodeImage
                  src={post.node.coverImage.url}
                  alt={post.node.title}
                />
              )}
              <HashNodeDescription>{post.node.subtitle}</HashNodeDescription>
              <Button>
                <a
                  href={post.node.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read on Hashnode
                </a>
              </Button>
            </HashNodePostItem>
          </Card>
        ))
      ) : (
        <p>No Hashnode posts to display</p>
      )}
    </HashNodePostsContainer>
  );
};

export default renderHashNodePosts;

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

const HashNodePostsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 50px;
  gap: 20px;
`;

const HashNodePostItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const HashNodeImage = styled.img`
  width: 300px;
  height: 200px;
  border-radius: 8px;
  margin-right: 15px;
  margin: 0 30px;
`;

const HashNodePostTitle = styled(Link)`
  font-size: 1.1em;
  margin: 10px 0;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;

const HashNodeDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
`;
