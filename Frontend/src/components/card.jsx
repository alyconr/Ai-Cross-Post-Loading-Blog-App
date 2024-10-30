import styled from 'styled-components';

import PropTypes from 'prop-types';



const CardContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const CardTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 15px;
`;

const Card = ({ title, children, count }) => (
  <CardContainer>
    <CardTitle>
      {title} {count !== undefined && `(${count})`}
    </CardTitle>

    {children}
  </CardContainer>
);

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  count: PropTypes.number,
};
export default Card;
