import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Avatar, Typography } from "@mui/material";
import blogPng from "../assets/blok.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { blogUpDate } from "../features/blog/blogSlice";
import BlogForm from "../components/BlogForm";

const UpdateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { currentBlogs } = useSelector((state) => state.blog);

  const selectedBlog = currentBlogs.find((blog) => blog.id === id);
  const [blogInfo, setBlogInfo] = useState(
    selectedBlog || {
      title: "",
      imageURL: "",
      content: "",
      published_date: Date.now(),
      get_comment_count: 0,
      get_like_count: 0,
      author: user?.displayName || "",
    }
  );

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
    if (pathname === `/update-blog/${id}`) {
      e.preventDefault();
      dispatch(
        blogUpDate({ updateBlog: blogInfo, id, published_date: Date.now() })
      );
      navigate(`/detail/${id}`);
    }
  };

  return (
    <Container
      sx={{
        maxWidth: "30rem !important",
        marginTop: "2rem",
        marginBottom: "2rem",
      }}
    >
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
            src={blogPng}
            style={{ maxWidth: "90%", maxHeight: "90%" }}
            alt="candela"
          />
        </Avatar>
        <Typography variant="h4" align="center" mt={2} color="primary.main">
          Update Blog
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

export default UpdateBlog;
