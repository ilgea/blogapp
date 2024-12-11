import Grid from "@mui/material/Grid2";
import BlogCard from "../components/BlogCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../features/blog/blogSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentBlogs, status } = useSelector((state) => state.blog);

  const [reversedBlogs, setReversedBlogs] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBlogs()); // Blogları almak için fetchBlogs thunk'ını çağır
    }
  }, [dispatch, status]);

  useEffect(() => {
    //  bloglar gelene kadar bekletiyoruz, sonra false'a çekip yğklemenin bittiğini söylüyoruz.
    if (status === "succeeded" || status === "failed") {
      setIsInitialLoading(false); 
    }
    setReversedBlogs([...currentBlogs].reverse());
  }, [currentBlogs, status]);

  if (isInitialLoading) {
    return <p>Bloglar yükleniyor. Lütfen Bekleyiniz...</p>;
  }

  return (
    <div style={{ marginTop: "4rem" }}>
      <Grid
        container
        sx={{ flexGrow: 1, justifyContent: "center", marginBottom: "2rem" }}
      >
        <Grid xs={12}>
          <Grid container sx={{ justifyContent: "center" }} spacing={5}>
            {status === "succeeded" &&
              reversedBlogs.length > 0 &&
              reversedBlogs?.map((blog, id) => (
                <Grid key={id}>
                  <BlogCard blog={blog} />
                </Grid>
              ))}
            {status === "succeeded" && reversedBlogs.length === 0 && (
              <h3>Blog bulunamadı.</h3>
            )}
            {status === "failed" && <p>Bloglar yüklenirken bir hata oluştu.</p>}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
