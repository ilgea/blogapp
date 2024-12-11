import { CardContent, Typography } from "@mui/material";
import { TextLineClamp } from "../utils/theme";
import CardActionArea from "@mui/material/CardActionArea";

const CardContentSection = ({ blog, handleGetDetailBlog }) => {
  const { id, content, title } = blog;
  return (
    <CardActionArea  onClick={() => handleGetDetailBlog(id)}>
      <CardContent sx={{ backgroundColor: "", borderBottom: "1px solid #ccc", height: "125px" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          sx={{ color: "primary.main" }}
        >
          {title}
        </Typography>
        <TextLineClamp
          gutterBottom
          variant="body2"
          sx={{ fontSize: "0.8rem", letterSpacing: ".2px", lineHeight: "1.3rem" , "&:hover": { color: "#D5A021" } }}
        >
          {content}
        </TextLineClamp>
      </CardContent>
    </CardActionArea>
  );
};

export default CardContentSection;
