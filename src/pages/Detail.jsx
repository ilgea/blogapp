import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CardCommentSection from "../components/CardCommentSection";
import { useEffect, useState } from "react";
import AddAndListComment from "../components/AddAndListComment";
import CardPostedActions from "../components/CardPostedSection";
import { Box } from "@mui/material";
import { theme } from "../utils/theme";
import { fetchBlogs } from "../features/blog/blogSlice";

const Detail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBlogs } = useSelector((state) => state.blog);
  const selectedBlog = currentBlogs.find((blog) => blog.id === id);
  // Yorumları Redux store'dan alıyoruz
  const [commentInfo, setCommentInfo] = useState([]);

  // Sayfa yüklendiğinde blogları çekiyoruz
  useEffect(() => {
    // Sayfa yüklendiğinde blogları çek
    if (!selectedBlog) {
      dispatch(fetchBlogs());
    } else {
      // Yorumları güncelle
      setCommentInfo(selectedBlog?.comments);
    }
  }, [dispatch, selectedBlog]);

  if (!selectedBlog) {
    // return <div>Loading blog. Please wait...</div>; // Veriler yüklenirken gösterilecek içerik
    return <div style={{ textAlign: "center", marginTop: "20px" }}>İlgili Blog getiriliyor...</div>; // Veriler yüklenirken gösterilecek içerik
  }

  const handleBLogUpdate = () => {
    navigate(`/update-blog/${id}`);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
          [theme.breakpoints.down("sm")]: { mx: 2 },
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            margin: 4,
            color: "primary.main",
            fontWeight: "bold",
          }}
          variant="h4"
          noWrap
        >
          {selectedBlog?.title || "Blog Title"}
        </Typography>
        <div>
          <Card
            sx={{
              minWidth: 300,
              maxWidth: 500,
              textAlign: "start",
              mb: 2,
            }}
          >
            <CardMedia
              component="img"
              // height="140"
              sx={{ objectFit: "cover" }}
              image={selectedBlog?.imageURL}
              alt="blog image"
            />
            <CardContent
              sx={{
                backgroundColor: "",
                borderBottom: "1px solid lightgrey",
                height: "auto",
              }}
            >
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                sx={{ color: "primary.main" }}
              >
                {selectedBlog?.title}
              </Typography>

              <Typography
                gutterBottom
                variant="body2"
                sx={{
                  fontSize: ".9rem",
                  letterSpacing: ".2px",
                  lineHeight: "1.4rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  padding:0.5
                }}
              >
                {selectedBlog?.content}
              </Typography>
            </CardContent>
            <CardPostedActions blog={selectedBlog} />
            <CardCommentSection
              blog={selectedBlog}
              handleBLogUpdate={handleBLogUpdate}
            />
          </Card>
        </div>
      </Box>
      <AddAndListComment
        blog={selectedBlog}
        commentInfo={commentInfo}
        setCommentInfo={setCommentInfo}
      />
    </>
  );
};

export default Detail;
