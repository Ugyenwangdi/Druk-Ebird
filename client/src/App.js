import { useEffect, useState, useCallback } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

import { Sidebar, Topbar } from "./components";
import {
  Signup,
  Login,
  ForgotPassword,
  PasswordReset,
  Dashboard,
  SpeciesList,
  AddSpecies,
  EditSpecies,
  SpeciesDetails,
  Checklist,
  Entries,
  Settings,
  AddAdmin,
  EditAdmin,
  UpdatePassword,
} from "./pages";

function App() {
  // const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // const [loading, setLoading] = useState(true);

  const [isValidToken, setIsValidtoken] = useState(false);

  const validateToken = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/checkLoggedIn`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 && res.data.valid) {
        setIsValidtoken(true);
      } else {
        localStorage.removeItem("token");
        setIsValidtoken(false);
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      setIsValidtoken(false);
    }
  }, [token]);

  useEffect(() => {
    validateToken();

    // getGoogleUser();
  }, [validateToken]);

  // Sidebar and toggle connection
  const [showSidebar, setShowSidebar] = useState(false);
  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };
  // adding an event listener to the window object to listen for changes in the screen size and update the state accordingly.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // hidding the sidebar in mobile and tablet screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setShowSidebar(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  // render loading spinner/message while loading is true
  // if (loading) {
  //   return (
  //     <div style={{ display: "flex", justifyContent: "center" }}>
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <>
      {isValidToken ? (
        <div>
          <Topbar onToggleSidebar={handleToggleSidebar} />
          <main>
            <Sidebar
              showSidebar={showSidebar}
              closeSidebar={handleCloseSidebar}
              onToggleSidebar={handleToggleSidebar}
              style={{ position: "fixed" }}
            />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/species" element={<SpeciesList />} />
              <Route path="/species/add" element={<AddSpecies />} />
              <Route path="/species/:id/edit" element={<EditSpecies />} />
              <Route path="/species/:id" element={<SpeciesDetails />} />
              <Route path="/entries" element={<Entries />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/add-admin" element={<AddAdmin />} />
              <Route path="/admins/:id/edit" element={<EditAdmin />} />
              <Route path="/password-update" element={<UpdatePassword />} />
              <Route path="/*" element={<Navigate replace to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/password-reset/:id/:token"
            element={<PasswordReset />}
          />
          <Route path="/*" element={<Navigate replace to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
