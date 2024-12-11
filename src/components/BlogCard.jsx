import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import placeholder from "../assets/placeholder.jpg";
import { useNavigate } from "react-router-dom";
import CardCommentSection from "./CardCommentSection";
import CardPostedSection from "./CardPostedSection";
import CardContentSection from "./CardContentSection";
import { Paper } from "@mui/material";

const BlogCard = ({ blog }) => {
  const { imageURL } = blog;

  const navigate = useNavigate();

  const handleGetDetailBlog = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <Paper elevation={12} square={false}>
      <Card sx={{ minWidth: 300, maxWidth: 300, textAlign: "start"}}>
        <CardMedia
          component="img"
          height="140"
          sx={{ objectFit: "cover" }}
          image={imageURL || placeholder}
          alt="blog image"
        />
        <CardContentSection
          blog={blog}
          handleGetDetailBlog={handleGetDetailBlog}
        />
        <CardPostedSection blog={blog} />
        <CardCommentSection blog={blog} />
      </Card>
    </Paper>
  );
};

export default BlogCard;
