import styled from 'styled-components';

const Card = ({ title, count }) => {
    return (
      <CardContainer>
        <Title>{title}</Title>
        <Count>{count}</Count>
      </CardContainer>
    );
  };
  
export default Card;
  
const CardContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1 1 200px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0 0 10px;
`;

const Count = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;