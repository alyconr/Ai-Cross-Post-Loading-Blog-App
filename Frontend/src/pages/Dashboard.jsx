import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import Card from '../components/card';
import axios from 'axios';
import ApiKeys from './ApiKeys';
import { AuthContext } from '../context/authContext';

import Profile from './Profile';
import Settings from '../components/settings';
import Bookmarks from './Bookmarks';
import Home from './Home';
import RenderDrafts from '../components/RenderDrafts';
import RenderFollowers from '../components/RenderFollowers';
import RenderFollowings from '../components/RenderFollowings';
import RenderBookmarks from '../components/RenderBookmarks';
import RenderMediumPosts from '../components/RenderMediumPosts';
import RenderDevtoPosts from '../components/RenderDevtoPosts';
import RenderHashNodePosts from '../components/RenderHashnodePosts';
import RenderLocalPosts from '../components/LocalPosts';
import AiFaqs from '../components/AiFaqs';
const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [mediumPosts, setMediumPosts] = useState([]);
  const [devtoPosts, setDevtoPosts] = useState([]);
  const [hashNodePosts, setHashNodePosts] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showMediumPosts, setShowMediumPosts] = useState(false);
  const [showDevtoPosts, setShowDevtoPosts] = useState(false);
  const [showHashNodePosts, setShowHashNodePosts] = useState(false);
  const [showLocalPosts, setShowLocalPosts] = useState(false);
  const [localPosts, setLocalPosts] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);

  const [drafts, setDrafts] = useState([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const axiosConfig = { withCredentials: true };
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/user/apikeys/${currentUser?.user.id}`,
          axiosConfig
        );
        setApiKeys(response.data);
      } catch (error) {
        console.error('Error fetching API keys:', error);
      }
    };

    if (currentUser?.user.id) {
      fetchApiKeys();
    }
  }, [currentUser?.user.id]); // Only depend on user ID

  // Main data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosConfig = { withCredentials: true };
        
        // Fetch basic data
        const [
          followersRes,
          followingRes,
          bookmarksRes,          
          localPostsRes,
          drafts,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URI}/followers/${currentUser?.user.id}`),
          axios.get(`${import.meta.env.VITE_API_URI}/followings/${currentUser?.user.id}`),
          axios.get(`${import.meta.env.VITE_API_URI}/bookmarks/${currentUser?.user.id}`),
          axios.get(`${import.meta.env.VITE_API_URI}/user/posts/${currentUser?.user.username}`),
          axios.get(`${import.meta.env.VITE_API_URI}/draftposts`),
        ]);

        setFollowers(followersRes.data);
        setFollowing(followingRes.data);
        setBookmarks(bookmarksRes.data);
        setLocalPosts(localPostsRes.data.posts);
        setDrafts(drafts.data.posts);

        // Only fetch platform data if we have API keys
        if (apiKeys && apiKeys.length > 0) {
          const platformRequests = [];
          const platformSetters = [];

          if (apiKeys[0].MediumToken) {
            platformRequests.push(axios.get(
              `${import.meta.env.VITE_API_URI}/medium-proxy/${currentUser?.user.id}`,
              axiosConfig
            ));
            platformSetters.push(setMediumPosts);
          }

          if (apiKeys[0].DevToToken) {
            platformRequests.push(axios.get(
              `${import.meta.env.VITE_API_URI}/devto-proxy/${currentUser?.user.id}`,
              axiosConfig
            ));
            platformSetters.push(setDevtoPosts);
          }

          if (apiKeys[0].HashNodeToken) {
            platformRequests.push(axios.get(
              `${import.meta.env.VITE_API_URI}/hashnode-proxy/${currentUser?.user.id}`,
              axiosConfig
            ));
            platformSetters.push(setHashNodePosts);
          }

          if (platformRequests.length > 0) {
            const responses = await Promise.all(platformRequests);
            responses.forEach((res, index) => {
              platformSetters[index](Array.isArray(res.data) ? res.data : [res.data]);
            });
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (currentUser?.user.id) {
      fetchData();
    }
  }, [currentUser?.user.id, currentUser?.user.username, apiKeys]);

  const handleClickFollowers = () => {
    setShowFollowers(true);
    // Only fetch if we don't have followers data
    if (!followers.length) {
      const fetchFollowers = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URI}/followers/${currentUser?.user.id}`
          );
          setFollowers(res.data);
        } catch (error) {
          console.error('Error fetching followers:', error);
        }
      };
      fetchFollowers();
    }
  };
  

  const handleClickFollowings = () => {
    setShowFollowings(true);
    if (!following.length) {
      // fetch only if needed
      const fetchFollowings = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URI}/followings/${currentUser?.user.id}`
          );
          setFollowing(res.data);
        } catch (error) {
          console.error('Error fetching followings:', error);
        }
      };
      fetchFollowings();
    }
  };

  const handleClickBookmarks = () => {
    setShowBookmarks(true);
    if (!bookmarks.length) {
      // fetch only if needed
      const fetchBookmarks = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URI}/bookmarks/${currentUser?.user.id}`
          );
          setBookmarks(res.data);
        } catch (error) {
          console.error('Error fetching bookmarks:', error);
        }
      };
      fetchBookmarks();
    }
  }
  const handleClickMediumPosts = async () => {
    setShowMediumPosts(true);
    if (!mediumPosts.length) {
      // fetch only if needed
      const fetchMediumPosts = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URI}/medium-proxy/${currentUser?.user.id}`
          );
          setMediumPosts(Array.isArray(res.data) ? res.data : [res.data]);
        } catch (error) {
          console.error('Error fetching medium posts:', error);
        }
      };
      fetchMediumPosts();
    }
  };

  const handleClickDevtoPosts = async () => {
    setShowDevtoPosts(true);
    
    if (!devtoPosts.length) {
      // fetch only if needed
      const fetchDevtoPosts = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URI}/devto-proxy/${currentUser?.user.id}`
          );
          setDevtoPosts(Array.isArray(res.data) ? res.data : [res.data]);
        } catch (error) {
          console.error('Error fetching devto posts:', error);
        }
      };
      fetchDevtoPosts();
    }
  };

  const handleClickHashNodePosts = async () => {
    setShowHashNodePosts(true);
    
    if (!hashNodePosts.length) {
      // fetch only if needed
      const fetchHashNodePosts = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URI}/hashnode-proxy/${currentUser?.user.id}`
          );
          setHashNodePosts(Array.isArray(res.data) ? res.data : [res.data]);
        } catch (error) { 
          console.error('Error fetching hashnode posts:', error);
        }
      };
      fetchHashNodePosts();
  }
  };

  const handleClickLocalPosts = async () => {
    setShowLocalPosts(true);
   
    if (!localPosts.length) {
      // fetch only if needed
      const fetchLocalPosts = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URI}/user/posts/${currentUser?.user.username}`
          );
          setLocalPosts(res.data.posts);
        } catch (error) {
          console.error('Error fetching local posts:', error);
        }
      };
      fetchLocalPosts();
    }
  };

  const handleDraftPosts = async () => {
    setShowDrafts(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URI}/draftposts`);

      setDrafts(res.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetActiveComponent = (component) => {
    setActiveComponent(component);
    if (component === 'dashboard') {
      setShowFollowers(false);
      setShowFollowings(false);
      setShowBookmarks(false);
      setShowMediumPosts(false);
      setShowDevtoPosts(false);
      setShowHashNodePosts(false);
      setShowLocalPosts(false);
      setShowDrafts(false);
    }
  };

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
      <Button onClick={handleClickMediumPosts}>
        <Card title="Medium Posts" count={mediumPosts.length} />
      </Button>
      <Button onClick={handleClickDevtoPosts}>
        <Card title="Dev.to Posts" count={devtoPosts.length} />
      </Button>
      <Button onClick={handleClickHashNodePosts}>
        <Card title="Hashnode Posts" count={hashNodePosts.length} />
      </Button>
      <Button onClick={handleDraftPosts}>
        <Card title="Drafts" count={drafts.length} />
      </Button>
      <Button onClick={handleClickLocalPosts}>
        <Card title="Total Local Posts" count={localPosts.length} />
      </Button>
    </>
  );

  const renderContent = () => {
    switch (activeComponent) {
      case 'profile':
        return <Profile />;
      case 'localPosts':
        return <Home />;
      case 'readingList':
        return <Bookmarks />;
      case 'apikeys':
        return <ApiKeys />;
      case 'settings':
        return <Settings />;
      case 'AiAgents':
        return <AiFaqs />;
      case 'dashboard':
      default:
        return (
          <>
            {showFollowers ? (
              <h1>Followers</h1>
            ) : showFollowings ? (
              <h1>Followings</h1>
            ) : showBookmarks ? (
              <h1>Bookmarks</h1>
            ) : showMediumPosts ? (
              <h1>Medium Posts</h1>
            ) : showDevtoPosts ? (
              <h1>Devto Posts</h1>
            ) : showHashNodePosts ? (
              <h1>Hashnode Posts</h1>
            ) : showLocalPosts ? (
              <h1>Local Posts</h1>
            ) : showDrafts ? (
              <h1>Drafts</h1>
            ) : (
              <h1>Dashboard</h1>
            )}
            <CardsContainer>
              {showFollowers ? (
                <RenderFollowers followers={followers} />
              ) : showFollowings ? (
                <RenderFollowings following={following} />
              ) : showBookmarks ? (
                <RenderBookmarks bookmarks={bookmarks} />
              ) : showMediumPosts ? (
                <RenderMediumPosts mediumPosts={mediumPosts} />
              ) : showDevtoPosts ? (
                <RenderDevtoPosts devtoPosts={devtoPosts} />
              ) : showHashNodePosts ? (
                <RenderHashNodePosts hashNodePosts={hashNodePosts} />
              ) : showLocalPosts ? (
                <RenderLocalPosts localPosts={localPosts} />
              ) : showDrafts ? (
                <RenderDrafts drafts={drafts} />
              ) : (
                renderDashboardCards()
              )}
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
