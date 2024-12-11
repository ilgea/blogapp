import {
  Box,
  Button,
  CardActions,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { IoChatboxOutline } from "react-icons/io5";
import { MdFavorite } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "../features/blog/blogSlice";
import { toastErrorNotify } from "../utils/ToastNotify";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, remove } from "firebase/database";
import { db } from "../utils/firebaseUtil";
import { toastSuccessNotify } from "../utils/ToastNotify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { LoadingButton } from "@mui/lab";

const CardCommentSection = ({ blog, handleBLogUpdate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { get_like_count, get_comment_count, likedUsers, id } = blog;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // butondaki loadin'in çalışıp çalışmadığını test için. çalışıyor
  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleBLogDelete = async () => {
    setLoading(true);
    try {
      await remove(ref(db, "blogs/" + id));
      setLoading(false);
      toastSuccessNotify("Blog silindi");
      setOpen(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      toastErrorNotify("Error", error);
    }
  };

  //! Kullanıcının beğenip beğenmediğini kontrol et
  const [isAlreadyLiked, setIsAlreadyLiked] = useState(
    likedUsers?.includes(user?.email) || false
  );

  const handleLikeClick = () => {
    if (!user) {
      toastErrorNotify("Please login to like this blog.");
      navigate("/login");
      return;
    }
    const newLikeStatus = !isAlreadyLiked;
    setIsAlreadyLiked(newLikeStatus);

    // Beğeni/Beğeni geri alma işlemi
    dispatch(
      toggleLike({
        blogId: id,
        userEmail: user?.email,
        isAlreadyLiked,
        likedUsers,
      })
    );
  };

  return (
    <Box display={"flex"} justifyContent={"space-between"}>
      <CardActions disableSpacing sx={{ padding: 0 }}>
        <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
          <MdFavorite color={isAlreadyLiked ? "red" : "grey"} />
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          {get_like_count}
        </Typography>
        <IconButton aria-label="chat box">
          <IoChatboxOutline />
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          {get_comment_count}
        </Typography>
      </CardActions>
      <div style={{ display: "flex", alignItems: "center" }}>
        {blog?.authorEmail === user?.email &&
          location.pathname === `/detail/${id}` && (
            <div style={{ display: "flex", columnGap: "10px" }}>
              <Button
                variant="contained"
                onClick={handleBLogUpdate}
                sx={{ backgroundColor: "buttonBg.main", fontSize: ".6rem", textTransform: "none" }}
                size="small"
              >
                Güncelle
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                sx={{ marginRight: "10px", fontSize: ".6rem", textTransform: "none" }}
                onClick={handleClickOpen}
              >
                Sil
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Bloğu silmek istiyor musunuz?"}
                </DialogTitle>
                <DialogActions>
                  <Button
                    sx={{
                      backgroundColor: "buttonBg.main",
                      textTransform: "none",
                    }}
                    size="small"
                    onClick={handleClose}
                    variant="contained"
                  >
                    İptal
                  </Button>
                  <LoadingButton
                    color="secondary"
                    size="small"
                    sx={{ backgroundColor: "", textTransform: "none" }}
                    loading={loading}
                    onClick={handleBLogDelete}
                    variant="contained"
                  >
                    Sil
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </div>
          )}
      </div>
    </Box>
  );
};

export default CardCommentSection;
