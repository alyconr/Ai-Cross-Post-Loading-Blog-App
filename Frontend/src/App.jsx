import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/authContext";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Write from "./pages/Write";
import Singlepost from "./pages/Singlepost";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";
import Hero from "./components/Hero";
import Profile from "./pages/Profile";
import Userposts from "./pages/Userposts";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/forgotPassword";
import Settings from "./components/settings";


const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const category = useLocation().search;

  return (
    <>
      <GlobalStyles />
      <ToastContainer />
      <Navbar />
      {isHome && !category && <Hero />}
      <Outlet />
      <Footer />
    </>
  );
};

const PrivateRoute = ({ element }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? element : <Navigate to="/login" />;
};

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/write",
        element: <PrivateRoute element={<Write />} />,
      },
      {
        path: "/singlepost/:id",
        element: <Singlepost />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
      {
        path: "/settings/:username",
        element: <Settings />,
      },
      {
        path: "/profile/:username/posts",
        element: <Userposts />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

function App() {
  return (
    <>
      <Container>
        <RouterProvider router={Router} />
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default App;
