import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { AuthContext } from './context/authContext';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Write from './pages/Write';
import Singlepost from './pages/Singlepost';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import styled from 'styled-components';
import GlobalStyles from './GlobalStyles';
import Hero from './components/Hero';
import Profile from './pages/Profile';
import Userposts from './pages/Userposts';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/forgotPassword';
import Settings from './components/settings';
import Bookmarks from './pages/Bookmarks';
import Dashboard from './pages/Dashboard';
import PropTypes from 'prop-types';

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const category = useLocation().search;
  const isDashboard = location.pathname === '/Dashboard/:username';

  return (
    <>
      <GlobalStyles />
      <ToastContainer />
      <Navbar />
      {isHome && !category && <Hero />}
      <Outlet />
      {isHome && !isDashboard && <Footer />}
    </>
  );
};

const PrivateRoute = ({ element }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? element : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

// Define routes configuration
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/write',
        element: <PrivateRoute element={<Write />} />,
      },
      {
        path: '/singlepost/:id/:title',
        element: <Singlepost />,
      },
      {
        path: '/profile/:username',
        element: <PrivateRoute element={<Profile />} />,
      },
      {
        path: '/settings/:username',
        element: <PrivateRoute element={<Settings />} />,
      },
      {
        path: '/profile/:username/posts',
        element: <PrivateRoute element={<Userposts />} />,
      },
      {
        path: '/profile/:username/bookmarks',
        element: <PrivateRoute element={<Bookmarks />} />,
      },
      {
        path: '/Dashboard/:username',
        element: <PrivateRoute element={<Dashboard />} />,
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
];

// Create router with all future flags
const router = createBrowserRouter(routes, {
  future: {
    
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
});

// Root component that contains both AuthContextProvider and RouterProvider
const Root = () => {
  return (
    <Container>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </Container>
  );
};

// Main App component
function App() {
  return <Root />;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default App;