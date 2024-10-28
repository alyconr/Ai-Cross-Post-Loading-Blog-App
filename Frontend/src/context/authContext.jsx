import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setcurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:9000/api/v1/auth/login",
      inputs,
      {
        withCredentials: true,
        credentials: "include",
      }
    );
    /*  const token = res.data.user.token;

    document.cookie = `token=${token}`;*/

    setcurrentUser(res.data);
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:9000/api/v1/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      //delete cookie
      /*
    document.cookie = "token=; max-age=0";*/

      setcurrentUser(null);
      toast.warning("Logout successfully", {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
