import Card from './card';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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

RenderLocalPosts.propTypes = {
  localPosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RenderLocalPosts;

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
