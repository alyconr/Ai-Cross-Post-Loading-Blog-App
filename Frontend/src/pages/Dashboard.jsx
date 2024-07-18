import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import Card from "../components/card";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import useFetch from "../utils/useFetch";
import Profile from "./Profile";
import Settings from "../components/settings";
import Bookmarks from "./Bookmarks";
import Home from "./Home";
const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [follow, setFollow] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const userName = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/v1/followers/${currentUser?.user.id}`
        );

        setFollowers(res.data);
        console.log(res.data);
        const values = res.data;

        const filter = values.filter(
          (value) => value.id === currentUser?.user.id
        );

        if (filter.length > 0) {
          if (filter[0].id === currentUser?.user.id) {
            setFollow(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowers();
  }, [user.id]);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/v1/followings/${currentUser?.user.id}`
        );

        setFollowing(res.data);
        console.log(res.data);

        const values = res.data;

        const filter = values.filter(
          (value) => value.id === currentUser?.user.id
        );

        if (filter.length > 0) {
          if (filter[0].id === currentUser?.user.id) {
            setFollowing(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowings();
  }, [user.id]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/v1/bookmarks/${currentUser?.user.id}`
        );

        setBookmarks(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookmarks();
  }, [currentUser?.user.id]);

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
            <h1>Dashboard</h1>
            <CardsContainer>
              <Card title="Followers" count={followers.length} />
              <Card title="Followings" count={following.length} />
              <Card title="Bookmarks" count={bookmarks.length} />
              <Card title="Medium Posts" count={10} />
              <Card title="Dev.to Posts" count={15} />
              <Card title="Hashnode Posts" count={5} />
              <Card title="Total Posts" count={30} />
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
        setActiveComponent={setActiveComponent}
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
