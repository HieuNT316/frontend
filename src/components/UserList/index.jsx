import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { Link } from 'react-router-dom';
import fetchModel from 'D:/Documents/Project/front-end/src/lib/fetchModelData';
import "./styles.css";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchModel('http://localhost:8081/api/user/list')
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Unexpected user list format:", data);
          setUsers([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch user list:", err);
        setUsers([]);
      });
  }, []); // chỉ gọi khi component mount

  return (
    <List>
      {users.map(user => (
        <ListItem
          button
          key={user._id}
          component={Link}
          to={`/user/${user._id}`}
        >
          <ListItemText primary={`${user.first_name} ${user.last_name}`} />
        </ListItem>
      ))}
    </List>
  );
}

export default UserList;
