import React, { useEffect, useState, useContext } from "react";
import "./styles.css";
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button
} from "@mui/material";
import UserContext from "../../UserContext";
import fetchModel from '../../lib/fetchModelData';

const formatDateTime = dateTimeStr => {
  const date = new Date(dateTimeStr);
  return date.toLocaleString();
};

function UserPhotos() {
  const { userId } = useParams();
  const { user: loggedUser } = useContext(UserContext);
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchModel(`http://localhost:8081/api/photo/photosOfUser/${userId}`),
      fetchModel(`http://localhost:8081/api/user/${userId}`)
    ])
      .then(([photosData, userData]) => {
        setPhotos(photosData);
        setUser(userData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi fetch dữ liệu ảnh hoặc người dùng:", err.message);
        setError("Unable to load user photos.");
        setLoading(false);
      });
  }, [userId]);

  const handleCommentChange = (photoId, value) => {
    setCommentInputs(prev => ({ ...prev, [photoId]: value }));
  };

  const handleAddComment = async (photoId) => {
    const commentText = commentInputs[photoId]?.trim();
    if (!commentText) return;

    try {
      const response = await fetch(`http://localhost:8081/api/commentsOfPhoto/${photoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ comment: commentText })
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newPhotos = await fetchModel(`http://localhost:8081/api/photo/photosOfUser/${userId}`);
      setPhotos(newPhotos);
      setCommentInputs(prev => ({ ...prev, [photoId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (loading) {
    return <Typography variant="body1">Loading photos...</Typography>;
  }

  if (error || !user) {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Photos of {user.first_name} {user.last_name}
      </Typography>

      {photos.map(photo => (
        <Card key={photo._id} style={{ marginBottom: '1rem' }}>
          <CardMedia
            component="img"
            alt={photo.file_name}
            height="300"
            image={`../../images/${photo.file_name}`}
            title={photo.file_name}
          />
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              Posted on: {formatDateTime(photo.date_time)}
            </Typography>
            <Typography variant="h6" gutterBottom>Comments:</Typography>
            {photo.comments && photo.comments.length > 0 ? (
              <List>
                {photo.comments.map((comment, index) => (
                  <ListItem key={`${photo._id}-${index}`} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <>
                          <Link to={`/user/${comment.user._id}`}>
                            {comment.user.first_name} {comment.user.last_name}
                          </Link>{' '}
                          commented at {formatDateTime(comment.date_time)}
                        </>
                      }
                      secondary={comment.comment}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">No comments yet</Typography>
            )}
            {loggedUser && (
              <>
                <TextField
                  label="Add a comment"
                  variant="outlined"
                  fullWidth
                  value={commentInputs[photo._id] || ""}
                  onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => handleAddComment(photo._id)}
                >
                  Post Comment
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
