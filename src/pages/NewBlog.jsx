import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Avatar, Typography } from "@mui/material";
import placeholder from "../assets/placeholder.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBlog, fetchBlogs } from "../features/blog/blogSlice";
import BlogForm from "../components/BlogForm";
import { useLocation, useNavigate } from "react-router-dom";

const NewBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);


  const [blogInfo, setBlogInfo] = useState({
    title: "",
    imageURL: "",
    content: "",
    authorEmail: user?.email || "",
    author: user?.displayName || "",
    published_date: Date.now(),
    updated_date: null, // başlangıçta güncelleme tarihi yok
    get_comment_count: 0,
    get_like_count: 0,
    likedUsers: ["0"],
    comments: [],
    authorUrl: user?.photoURL || "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogInfo((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    if (pathname === "/new-blog") {
      e.preventDefault();
      dispatch(addBlog(blogInfo));
      dispatch(fetchBlogs());
      navigate("/");
    }
  };

  return (
    <Container sx={{ maxWidth: "30rem !important", marginTop: "2rem" }}>
      <Box>
        <Avatar
          sx={{
            width: "clamp(4rem, 25vw, 8rem)",
            height: "clamp(4rem, 25vw, 8rem)",
            margin: "0 auto",
            backgroundColor: "primary.main",
          }}
        >
          <img
            src={placeholder}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            alt="blogholder"
          />
        </Avatar>
        <Typography variant="h4" align="center" mt={2} color="primary.main">
          Yeni Blog
        </Typography>
        <BlogForm
          handleChange={handleChange}
          blogInfo={blogInfo}
          handleSubmit={handleSubmit}
        />
      </Box>
    </Container>
  );
};

export default NewBlog;
