import styled from 'styled-components';
import propTypes from 'prop-types';

const TagsInput = ({ tags, setTags }) => {
  const removeTags = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const addTags = (event) => {
    if (event.target.value !== '' && event.key === 'Enter') {
      const newTags = [...tags, event.target.value];
      setTags(newTags);

      event.target.value = '';

      console.log(newTags); // Log the updated tags
    }
  };

  return (
    <Container>
      <TagsContainer>
        {Array.isArray(tags) &&
          tags.map((tag, index) => (
            <Tag key={index}>
              <TagTitle>{tag}</TagTitle>
              <TagCloseIcon onClick={() => removeTags(index)}>x</TagCloseIcon>
            </Tag>
          ))}
        <Input
          type="text"
          onKeyUp={(event) => addTags(event)}
          placeholder="Press enter to add tags"
        />
      </TagsContainer>
    </Container>
  );
};

TagsInput.propTypes = {
  tags: propTypes.array.isRequired,
  setTags: propTypes.func.isRequired,
};

export default TagsInput;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 0.5rem;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 0.5rem;
  margin: 0.25rem;
  color: #fff;
  font-weight: bold;
  background: hsla(58, 77%, 50%, 1);

  background: linear-gradient(
    90deg,
    hsla(58, 77%, 50%, 1) 0%,
    hsla(281, 95%, 52%, 1) 100%
  );

  background: -moz-linear-gradient(
    90deg,
    hsla(58, 77%, 50%, 1) 0%,
    hsla(281, 95%, 52%, 1) 100%
  );

  background: -webkit-linear-gradient(
    90deg,
    hsla(58, 77%, 50%, 1) 0%,
    hsla(281, 95%, 52%, 1) 100%
  );

  filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#E2DB1F", endColorstr="#AE10F9", GradientType=1 );
`;

const TagTitle = styled.span`
  margin-right: 0.5rem;
`;

const TagCloseIcon = styled.span`
  display: block;
  width: 20px;
  height: 20px;
  text-align: center;
  font-size: 14px;
  margin-left: 8px;
  color: #fff;
  background-image: linear-gradient(
    45deg,
    hsl(60deg 4% 5%) 0%,
    hsl(77deg 3% 9%) 11%,
    hsl(97deg 4% 11%) 22%,
    hsl(119deg 3% 14%) 33%,
    hsl(140deg 5% 17%) 44%,
    hsl(154deg 6% 20%) 56%,
    hsl(164deg 7% 23%) 67%,
    hsl(173deg 8% 27%) 78%,
    hsl(181deg 8% 30%) 89%,
    hsl(187deg 9% 33%) 100%
  );
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

const Input = styled.input`
  font-size: 25px;
  flex: 1;
  min-width: 100px;
  border: none;

  &:focus {
    outline: none;
  }
`;
