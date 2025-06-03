import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation } from 'react-router-dom';
import fetchModel from 'D:/Documents/Project/front-end/src/lib/fetchModelData'; // chỉnh đường dẫn đúng nếu khác
import UserContext from "../../UserContext.js";
import { useContext } from "react";
import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
const TopBar = () => {
  const location = useLocation();
  const [contextText, setContextText] = useState('');
  const { user, logout } = useContext(UserContext);

  useEffect(() => {
    const path = location.pathname;
    const pathParts = path.split('/');

    // /user/:id or /photosOfUser/:id
    if ((path.startsWith('/user/') || path.startsWith('/photosOfUser/')) && pathParts.length >= 3) {
      const userId = pathParts[2];

      // Gọi fetchModel để lấy thông tin user
      fetchModel(`http://localhost:8081/api/user/${userId}`)
        .then(user => {
          if (user && user.first_name && user.last_name) {
            if (path.startsWith('/photos/')) {
              setContextText(`Photos of ${user.first_name} ${user.last_name}`);
            } else {
              setContextText(`${user.first_name} ${user.last_name}`);
            }
          } else {
            setContextText('');
          }
        })
        .catch(err => {
          //console.error("Failed to fetch user:", err);
          setContextText('');
        });

    } else if (path === '/user') {
      setContextText('User List');
    } else {
      setContextText('');
    }
  }, [location]);

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Left side: your name */}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Nguyen Trung Hieu B22DCCN316
        </Typography>
        {user ? (
          <>
            <Typography variant="h6">Hi {user.first_name}</Typography>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        ) : (
          <Typography variant="h6">Please Login</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
