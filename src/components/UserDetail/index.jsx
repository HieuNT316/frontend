import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Button } from "@mui/material";
import { useParams, Link } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';
import "./styles.css";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Đang fetch user với ID:", userId);
    fetchModel(`http://localhost:8081/api/user/${userId}`)
      .then((data) => {
        console.log("Dữ liệu user trả về:", data);
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch user:", err.message);
        setError("Unable to load user details.");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <Typography variant="body1">Loading user...</Typography>;
  }

  if (error || !user) {
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography color="textSecondary">{user.occupation}</Typography>
        <Typography variant="body1">{user.description}</Typography>
        <Typography variant="body2">Location: {user.location}</Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/photosOfUser/${user._id}`}
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
