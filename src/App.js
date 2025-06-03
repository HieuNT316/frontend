import './App.css';

import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import UserContext from "./UserContext";

const App = () => {
  const [user, setUser] = useState(null);

  const logout = async () => {
    try {
      await fetch("http://localhost:8081/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>

            <div className="main-topbar-buffer" />
            
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                {user ? <UserList /> : null}
              </Paper>
            </Grid>

            <Grid item sm={9}>
              <Paper className="main-grid-item">
                {user ? (
                  <Routes>
                    <Route path="/user/:userId" element={<UserDetail />} />
                    <Route path="/photosOfUser/:userId" element={<UserPhotos />} />
                    <Route path="/user" element={<UserList />} />
                    <Route path="*" element={<Navigate to={`/user/${user._id}`} />} />
                  </Routes>
                ) : (
                  <LoginRegister />
                )}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
