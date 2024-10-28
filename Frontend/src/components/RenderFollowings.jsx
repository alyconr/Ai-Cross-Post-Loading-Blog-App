import Card from "./card";
import styled from "styled-components";
import followerUser from "../assets/follower.png";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const RenderFollowings = ({ following }) => (
    <FollowersContainer>
      {Array.isArray(following) && following.length > 0 ? (
        following.map((followings) => (
          <Card 
            key={followings.id}>
            <FollowerItem key={followings.id}>
              {followings.userImage ? (
                <UserImage
                  src={`../upload/${followings.userImage}`}
                  alt={followings.fullname}
                />
              ) : (
                <UserImage src={followerUser} alt={followings.username} />
              )}
              <FollowerInfo>
                <FollowerName to={`/profile/${followings.username}`}>
                  {followings.fullname}
                </FollowerName>
                <FollowerUsername>@{followings.username}</FollowerUsername>
              </FollowerInfo>
            </FollowerItem>
          </Card>
        ))
      ) : (
        <p>No followings to display</p>
      )}
    </FollowersContainer>
);

RenderFollowings.propTypes = {
  following: PropTypes.array.isRequired,
};

export default RenderFollowings;
  
const FollowersContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 50px;
  gap: 20px;
`;

const FollowerName = styled(Link)`
  font-size: 1.1em;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;

const FollowerUsername = styled.span`
  font-size: 0.9em;
  color: #666;
`;

const FollowerItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

const FollowerInfo = styled.div`
  display: flex;
  flex-direction: column;

  a {
    font-weight: bold;
    color: #333;
    text-decoration: none;
    margin-bottom: 5px;
  }

  span {
    font-size: 0.9em;
    color: #666;
  }
`;
