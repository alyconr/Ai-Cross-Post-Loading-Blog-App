import Card from "./card";
import styled from "styled-components";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const RenderMediumPosts = ({ mediumPosts }) => {
    return (
      <MediumPostsContainer>
        {mediumPosts.length > 0 ? (
          mediumPosts.map((post) => (
            <Card key={post.guid}>
              <MediumPostItem>
                <MediumPostTitle>{post.title}</MediumPostTitle>
                {post.thumbnail && (
                  <MediumImage src={post.thumbnail} alt={post.title} />
                )}
                <Button>
                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    Read on Medium
                  </a>
                </Button>
              </MediumPostItem>
            </Card>
          ))
        ) : (
          <p>No Medium posts to display</p>
        )}
      </MediumPostsContainer>
    );
};


RenderMediumPosts.propTypes = {
    mediumPosts: PropTypes.array.isRequired,
  };
  

export default RenderMediumPosts;
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

const MediumPostsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 50px;
  gap: 20px;
`;

const MediumPostItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const MediumImage = styled.img`
  width: 300px;
  height: 200px;
  border-radius: 8px;
  margin-right: 15px;
  margin: 0 30px;
`;

const MediumPostTitle = styled(Link)`
  font-size: 1.1em;
  margin: 10px 0;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;
