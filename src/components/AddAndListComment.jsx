import {
  Box,
  Button,
  TextField,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toastErrorNotify, toastSuccessNotify } from "../utils/ToastNotify";
import {
  blogAddComment,
  deleteComment,
  fetchBlogs,
  singleBlogCommentUpdate,
} from "../features/blog/blogSlice";
import moment from "moment";
import placeHolderUser from "../assets/userholder.png";
import { LuPencilLine } from "react-icons/lu";
import { theme } from "../utils/theme";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "10px",
};

const AddAndListComment = ({ blog, commentInfo, setCommentInfo }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { id } = blog;
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [commentValues, setCommentValues] = useState({
    commentText: "",
  });

  // Güncelleme Modalı için State'ler
  const [selectedComment, setSelectedComment] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommentValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!commentValues.commentText) {
      toastErrorNotify("Lütfen yorumunuzu giriniz.");
      return;
    }

    const newComment = {
      commentText: commentValues.commentText,
      author: user?.displayName || "noname",
      authorEmail: user?.email || "nomail",
      published_date: Date.now(),
      commentAuthorUrl: user?.photoURL || placeHolderUser,
    };
    dispatch(blogAddComment({ id, comment: newComment }));
    // Formu temizle
    setCommentValues({ commentText: "" });
  };

  const handleCommentDelete = async (commentIndex) => {
    dispatch(deleteComment({ id, commentIndex }));
    toastSuccessNotify("Yorum silindi");
  };

  const handleCommentUpdate = (comment, commentIndex) => {
    setOpen(true);
    setSelectedComment(comment);
    setCurrentIndex(commentIndex);
  };

  const handleModalChange = (e) => {
    setSelectedComment(e.target.value);
  };

  const updatedCommentInfo = commentInfo?.map((comment, index) =>
    index === currentIndex
      ? { ...comment, commentText: selectedComment }
      : comment
  );

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setCommentInfo(updatedCommentInfo);
    dispatch(singleBlogCommentUpdate({ id, comments: updatedCommentInfo }));
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [commentInfo]);


  return (
    <>
      <Box
        sx={{
          maxWidth: 500,
          minWidth: 200,
          margin: "auto",
          [theme.breakpoints.down("sm")]: { mx: 2 },
          [theme.breakpoints.up("sm")]: { mx: "auto" },
        }}
      >
        <Paper
          sx={{
            maxWidth: "100%",
            minWidth: "100%",
            padding: 1,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <div style={{ width: "30px", height: "30px" }}>
              <img
                src={user?.photoURL || placeHolderUser}
                alt="user avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div style={{ flexGrow: 1 }}>
              <TextField
                margin="none"
                id="outlined-textarea"
                label="Yorum yap..."
                name="commentText"
                type="text"
                fullWidth
                multiline
                rows={2}
                value={commentValues.commentText}
                onChange={handleChange}
                // color="secondary"
                size="small"
                sx={{ margin: "0px 5px" }}
              />
            </div>
            <div>
              <Button
                size="small"
                sx={{
                  marginLeft: 2,
                  textTransform: "none",
                  backgroundColor: "buttonBg.secondary",
                }}
                variant="contained"
                endIcon={<IoMdSend style={{ fontSize: ".8rem" }} />}
                type="submit"
                onClick={handleSubmit}
              >
                Gönder
              </Button>
            </div>
          </Box>
        </Paper>
      </Box>

      {/* MODAL BAŞLANGICI  */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <TextField
              size="small"
              margin="normal"
              fullWidth
              label="Düzenle"
              name="commentText"
              multiline
              rows={2}
              value={selectedComment?.commentText}
              onChange={handleModalChange}
            />
            <Box display={"flex"} justifyContent={"end"}>
              <Button
                size="small"
                sx={{ marginTop: 1, textTransform: "none" }}
                variant="contained"
                type="submit"
                endIcon={<IoMdSend style={{ fontSize: ".8rem" }} />}
                onClick={handleModalSubmit}
              >
                Gönder
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/* MODAL SONU */}

      {/* Yorum Bölümü Başlangıcı */}
      <Box
        sx={{
          maxWidth: 500,
          minWidth: 300,
          margin: "20px auto 50px",
          [theme.breakpoints.down("sm")]: { mx: 2 },
          // [theme.breakpoints.up("sm")]: {mx: 2},
        }}
      >
        {commentInfo?.length > 0 &&
          commentInfo?.map((comment, index) => (
            <Paper
              key={comment?.published_date || index}
              elevation={2}
              square={false}
              sx={{
                maxWidth: "100%",
                minWidth: "100%",
                padding: 1.5,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: "10px",
                textAlign: "start",
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  padding: "0px",
                  margin: "0px",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    columnGap="10px"
                  >
                    <Box
                      sx={{
                        width: "20px",
                        height: "20px",
                      }}
                    >
                      <img
                        src={comment?.commentAuthorUrl || placeHolderUser}
                        alt="user avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: "700", fontSize: ".75rem",lineHeight: "1.43", }}>
                        {comment?.author}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: ".6rem",lineHeight: "1.43", color:"#0009" }}>
                        {/* {moment(comment?.published_date).fromNow()} */}
                        {moment(comment?.published_date).diff(moment(), 'minutes')* -1 >= 1 ? moment(comment?.published_date).fromNow().replace("önce",""): "Şimdi"}
                      </Typography>
                    </Box>
                  </Box>
                  {user?.email === comment?.authorEmail && (
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="update"
                        onClick={() => handleCommentUpdate(comment, index)}
                        color="success"
                        size="small"
                      >
                        <LuPencilLine />
                        <Typography sx={{ marginLeft: 0.5 }}></Typography>
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        sx={{ marginLeft: 1 }}
                        onClick={() => handleCommentDelete(index)}
                        color="secondary"
                        size="small"
                      >
                        <MdDeleteForever />
                        <Typography sx={{ marginLeft: 0.5 }}></Typography>
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Box margin="0px" padding="0px">
                  {/* <p style={{ padding: "0px", margin: "20px 0px 10px 0px " }}>
                    {comment?.commentText}
                  </p> */}
                  <Typography
                    sx={{ padding: "0px", margin: "5px 0px 0px 0px" }}
                  >
                    {comment?.commentText}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
      </Box>

      {/* Yorum Bölümü Sonu */}
    </>
  );
};

export default AddAndListComment;
