import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import Card from "../components/card";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import useFetch from "../utils/useFetch";
import Profile from "./Profile";
import Settings from "../components/settings";
import Bookmarks from "./Bookmarks";
import Home from "./Home";
import followerUser from "../assets/follower.png";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [followersRes, followingRes, bookmarksRes] = await Promise.all([
          axios.get(
            `http://localhost:9000/api/v1/followers/${currentUser?.user.id}`
          ),
          axios.get(
            `http://localhost:9000/api/v1/followings/${currentUser?.user.id}`
          ),
          axios.get(
            `http://localhost:9000/api/v1/bookmarks/${currentUser?.user.id}`
          ),
        ]);

        console.log("Initial followers data:", followersRes.data);
        setFollowers(followersRes.data);
        setFollowing(followingRes.data);
        setBookmarks(bookmarksRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (currentUser?.user.id) {
      fetchData();
    }
  }, [currentUser?.user.id]);

  const handleClickFollowers = async () => {
    setShowFollowers(true);
    try {
      const res = await axios.get(
        `http://localhost:9000/api/v1/followers/${currentUser?.user.id}`
      );
      console.log("Followers data after click:", res.data);
      setFollowers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickFollowings = async () => {
    setShowFollowings(true);
    try {
      const res = await axios.get(
        `http://localhost:9000/api/v1/followings/${currentUser?.user.id}`
      );
      console.log("Followings data after click:", res.data);
      setFollowing(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickBookmarks = async () => {
    setShowBookmarks(true);
    try {
      const res = await axios.get(
        `http://localhost:9000/api/v1/bookmarks/${currentUser?.user.id}`
      );
      console.log("Bookmarks data after click:", res.data);
      setBookmarks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetActiveComponent = (component) => {
    setActiveComponent(component);
    if (component === "dashboard") {
      setShowFollowers(false);
      setShowFollowings(false);
      setShowBookmarks(false);
    }
  };

  const renderFollowers = () => (
    <FollowersContainer>
      {Array.isArray(followers) && followers.length > 0 ? (
        followers.map((follower) => (
          <Card>
            <FollowerItem key={follower.id}>
              {follower.userImage ? (
                <UserImage
                  src={`../upload/${follower.userImage}`}
                  alt={follower.fullname}
                />
              ) : (
                <UserImage src={followerUser} alt={follower.username} />
              )}
              <FollowerInfo>
                <FollowerName to={`/profile/${follower.username}`}>
                  {follower.fullname}
                </FollowerName>
                <FollowerUsername>@{follower.username}</FollowerUsername>
              </FollowerInfo>
            </FollowerItem>
          </Card>
        ))
      ) : (
        <p>No followers to display</p>
      )}
    </FollowersContainer>
  );

  const renderFollowings = () => (
    <FollowersContainer>
      {Array.isArray(following) && following.length > 0 ? (
        following.map((followings) => (
          <Card>
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

  const renderBookmarks = () => (
    <BookmarksContainer>
      {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
        bookmarks.map((bookmark) => (
          <Card key={bookmark.id}>
            <BookmarkItem>
              <BookmarkImage src={bookmark.image} />
              <BookmarkInfo>
                <BookmarkTitle>{bookmark.title}</BookmarkTitle>
                <BookmarkDescription></BookmarkDescription>
                <BookmarkAuthor> By {bookmark.author_fullname}</BookmarkAuthor>
              </BookmarkInfo>
              <Link
                className="btn btn-dark btn-sm btn-block "
                to={`/singlepost/${bookmark.id}/title=${encodeURIComponent(
                  bookmark.title.replace(/ /g, "-")
                )}`}
              >
                {" "}
                <Button className="text-white">Read More</Button>
              </Link>
            </BookmarkItem>
          </Card>
        ))
      ) : (
        <p>No bookmarks to display</p>
      )}
    </BookmarksContainer>
  );

  const renderDashboardCards = () => (
    <>
      <Button onClick={handleClickFollowers}>
        <Card title="Followers" count={followers.length} />
      </Button>
      <Button onClick={handleClickFollowings}>
        <Card title="Followings" count={following.length} />
      </Button>
      <Button onClick={handleClickBookmarks}>
        <Card title="Bookmarks" count={bookmarks.length} />
      </Button>
      <Card title="Medium Posts" count={10} />
      <Card title="Dev.to Posts" count={15} />
      <Card title="Hashnode Posts" count={5} />
      <Card title="Total Posts" count={30} />
    </>
  );

  const renderContent = () => {
    switch (activeComponent) {
      case "profile":
        return <Profile />;
      case "localPosts":
        return <Home />;
      case "readingList":
        return <Bookmarks />;
      case "settings":
        return <Settings />;
      case "dashboard":
      default:
        return (
          <>
            {showFollowers ? (
              <h1>Followers</h1>
            ) : showFollowings ? (
              <h1>Followings</h1>
            ) : (
              <h1>Dashboard</h1>
            )}
            <CardsContainer>
              {showFollowers
                ? renderFollowers()
                : showFollowings
                ? renderFollowings()
                : showBookmarks
                ? renderBookmarks()
                : renderDashboardCards()}
            </CardsContainer>
          </>
        );
    }
  };

  return (
    <DashboardContainer>
      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setActiveComponent={handleSetActiveComponent}
      />
      <MainContent>{renderContent()}</MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
const DashboardContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  flex-grow: 1;
  flex-basis: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f0f2f5;

  h1 {
    margin-top: 20px;
    padding: 20px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 10px;
`;

const FollowersContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
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

const BookmarksContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const BookmarkItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BookmarkImage = styled.img`
  width: 200px;
  height: 150px;
  border-radius: 8px;
  margin-right: 15px;
  margin: 0 30px;
`;

const BookmarkTitle = styled(Link)`
  font-size: 1.1em;
  margin: 10px 0;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;

const BookmarkInfo = styled.div`
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

const BookmarkAuthor = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
`;

const BookmarkDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
`;
