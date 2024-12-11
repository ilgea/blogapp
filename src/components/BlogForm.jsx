import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useLocation } from "react-router-dom";
import { theme } from "../utils/theme";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebaseUtil";
import { v4 } from "uuid";
import { toastErrorNotify, toastSuccessNotify } from "../utils/ToastNotify";

const BlogForm = ({
  handleChange,
  blogInfo,
  handleSubmit,
}) => {
  const { pathname } = useLocation();

  const [uploadedImage, setUploadedImage] = useState(null);
  const [listImage, setListImage] = useState("");
  const [isUploading, setIsUploading] = useState(false); // Yükleme durumu için state

  const handleSelectImage = (e) => {
    if (e.target.files[0].size > 512000) {
      toastErrorNotify("Resim boyutu 500kb'den fazla olamaz");
      setUploadedImage(e.target.files[0]);
    } else {
      setUploadedImage(e.target.files[0]);
    }
  };

  const handleUploadFile = () => {
    if (uploadedImage == null || uploadedImage?.size > 521000) return;
    setIsUploading(true);
    const imageRef = ref(storage, `blogimages/${uploadedImage?.name + v4()}`);
    uploadBytes(imageRef, uploadedImage).then((res) => {
      getDownloadURL(res.ref)
        .then((url) => {
          setListImage(url);
          handleChange({ target: { name: "imageURL", value: url } });
          toastSuccessNotify("Resim yüklendi");
          setIsUploading(false);
        })
        .catch((err) => {
          toastErrorNotify("err", err);
          setIsUploading(false);
        });
    });
  };


  // target: Gerçek bir DOM olayında, event'in gerçekleştiği DOM elemanını temsil eder.
  // Örneğin, bir TextField'a bir şeyler yazdığınızda bu input elementi olur.

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        margin="normal"
        id="title"
        label="Title *"
        name="title"
        autoFocus
        fullWidth
        value={blogInfo.title}
        onChange={handleChange}
        color="secondary"
        size="small"
        slotProps={{ htmlInput: { minLength: 3, maxLength: 50 } }}
        helperText="En az 3, en fazla 50 karakter giriniz"
        sx={{ marginBottom: 0 }}
      />

      <TextField
        margin="normal"
        id="image"
        label="Image URL *"
        type="text"
        name="imageURL"
        fullWidth
        value={blogInfo.imageURL || listImage}
        onChange={handleChange}
        color="secondary"
        helperText="Paste image URL or upload image from local->(max-500kb)"
        size="small"
      />
      <Box
        sx={{
          textAlign: "start",
          [theme.breakpoints.down("sm")]: {
            display: "flex",
            flexDirection: "column",
            rowGap: 1,
          },
        }}
      >
        <input
          type="file"
          onChange={handleSelectImage}
          style={{ fontSize: ".9rem" }}
        />
        <Button
          onClick={handleUploadFile}
          variant="contained"
          sx={{ width: "9rem", backgroundColor: "buttonBg.main" }}
          size="small"
          disabled={isUploading || uploadedImage?.size > 521000}
        >
          {isUploading ? "Uploading..." : "Upload image"}
        </Button>
      </Box>

      <div style={{ width: "100px" }}>
        <img
          src={listImage}
          alt=""
          style={{ width: "100%", objectFit: "cover" }}
          hidden={!listImage && true}
        />
      </div>

      <TextField
        margin="normal"
        id="outlined-textarea"
        label="Content *"
        name="content"
        type="text"
        fullWidth
        multiline
        rows={10}
        value={blogInfo.content}
        onChange={handleChange}
        color="secondary"
        size="small"
      />

      <LoadingButton
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{ mt: 3, textTransform: "none" }}
      >
        {pathname !== "/new-blog" ? "Update" : "Add Blog"}
      </LoadingButton>
    </form>
  );
};

export default BlogForm;
