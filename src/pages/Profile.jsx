import Typography from "@mui/material/Typography";
import userholder from "../assets/userholder.png";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Box, Paper, TextField } from "@mui/material";
import { theme } from "../utils/theme";
import { useState } from "react";
import { toastErrorNotify, toastSuccessNotify } from "../utils/ToastNotify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../utils/firebaseUtil";
import { v4 } from "uuid";
import { updateProfile } from "firebase/auth";
import {
  blogProfilAvatarUpdate,
  blogProfilNameUpdate,
} from "../features/blog/blogSlice";
import { setUser, updateUserAvatar } from "../features/auth/authSlice";
import { LoadingButton } from "@mui/lab";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isUploading, setIsUploading] = useState(false); // Resim Yükleme durumu için state
  const [isNameUploading, setIsNameUploading] = useState(false); // İsim Yükleme durumu için state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [newUsername, setNewUsername] = useState("");

  const [currentUserName, setCurrentUserName] = useState(
    user?.displayName || ""
  );
  const dispatch = useDispatch();

  //! Add function to handle displayName update
  const handleUsernameUpdate = () => {
    setIsNameUploading(true);
    if (newUsername.length < 3) {
      toastErrorNotify(
        "Kullanıcı adı en az 3 karakterli olmalıdır"
      );
      setIsNameUploading(false);
      return;
    }
    updateProfile(auth.currentUser, { displayName: newUsername })
      .then(() => {
        setCurrentUserName(newUsername); // Update local state

        // Update Redux state
        const updatedUser = {
          displayName: newUsername,
          email: user?.email, // Mevcut email bilgisini koruyoruz
          photoURL: user?.photoURL || null,
        };
        dispatch(setUser(updatedUser));

        // Trigger blog update for author name consistency
        dispatch(
          blogProfilNameUpdate({
            authorName: updatedUser?.displayName,
            userEmail: user?.email,
          })
        );
        toastSuccessNotify("Kullanıcı adı güncellendi!");
        setIsNameUploading(false);
        setNewUsername("");
      })
      .catch((error) => {
        toastErrorNotify("Güncelleme hatası:", error);
        setIsNameUploading(false);
      });
  };

  const handleProfileUpdate = (url) => {
    updateProfile(auth.currentUser, {
      photoURL: `${url}`,
    })
      .then(() => {
        // Profile updated
        dispatch(updateUserAvatar(url));
        dispatch(
          blogProfilAvatarUpdate({ authorUrl: url, userEmail: user?.email })
        );
        toastSuccessNotify("Profil resmi güncellendi!");
      })
      .catch((error) => {
        toastErrorNotify("error", error);
      });
  };

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
          setIsUploading(false);
          handleProfileUpdate(url);
        })
        .catch((err) => {
          toastErrorNotify("error", err);
          setIsUploading(false);
        });
    });
  };

  const handleProfilInfoChange = async () => {
    try {
      if (uploadedImage) {
        handleUploadFile();
      }
      if (newUsername) {
        handleUsernameUpdate();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Paper
        variant="elevation"
        elevation={24}
        square={false}
        sx={{
          maxWidth: 545,
          minWidth: 320,
          margin: "50px auto 50px",
          backgroundColor: "inherit",
        }}
      >
        <Box
          display={"flex"}
          height={"auto"}
          columnGap={2}
          padding={2}
          sx={{
            borderRadius: "10px",
            backgroundColor: "#F7F9F9",
            [theme.breakpoints.down("sm")]: {
              rowGap: 2,
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "column",
            },
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            rowGap={0.4}
            padding={1}
            alignItems={"center"}
            sx={{
              // backgroundColor: "lightsalmon",
              background:
                "linear-gradient(90deg, rgba(238,90,111,1) 34%, rgba(242,146,99,1) 100%)",

              borderRadius: "10px 0 0 10px",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
                borderRadius: "10px 10px 0 0",
              },
            }}
          >
            <Avatar
              alt="user avatar"
              src={user.photoURL || userholder}
              // src={auth.currentUser?.photoURL || userholder}
              sx={{ width: 56, height: 56, objectFit: "cover" }}
            />
            <Typography
              sx={{
                padding: "0.4rem 0.4rem .4rem 0",
                textAlign: "start",
                color: "white",
              }}
            >
              {currentUserName || "Not Found!"}
            </Typography>
            <Typography
              sx={{
                padding: ".4rem 0.4rem .4rem 0",
                textAlign: "start",
                color: "white",
              }}
            >
              {/* {user.email || "Not Found!"} */}
              {auth.currentUser?.email || "Not Found!"}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            rowGap={1}
            alignItems={"flex-start"}
            width={"100%"}
            position={"relative"}
            sx={{
              [theme.breakpoints.down("sm")]: { paddingLeft: 1 },
            }}
          >
            <Typography
              sx={{
                paddingTop: ".5rem",
                [theme.breakpoints.down("sm")]: { padding: 0 },
              }}
            >
              Adımdan sıkıldım:
            </Typography>
            <TextField
              label="Yeni kullanıcı isminizi giriniz"
              // variant="outlined"
              // variant="standard"
              slotProps={{
                inputLabel: {
                  // label'in stili
                  sx: {
                    fontSize: ".8rem",
                    left: -5, // label'ın sağındaki boşluğu azalttık. konumu position ile ayarlandığından px yerine bu şekilde ayarlıyoruz.
                    top: -3,
                  },
                },
                htmlInput: {
                  minLength: 3,
                  maxLength: 20,
                  // input'in stili
                  sx: {
                    padding: 0.5, // input içindeki boşluğu küçülttük.
                  },
                },
                input: {
                  // input içindeki yazıların stili
                  sx: {
                    paddingLeft: 1, // input içindeki yazıların soluna 8px bosluk ekledik
                  },
                },
              }}
              helperText="En az 3, en fazla 20 karakter giriniz"
              size="small"
              fullWidth
              name="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />

            <Typography>Resmimden de: </Typography>
            <input
              type="file"
              onChange={handleSelectImage}
              style={{ fontSize: ".8rem" }}
            />
            <LoadingButton
              // onClick={handleUploadFile}
              onClick={handleProfilInfoChange}
              variant="contained"
              sx={{
                // position: "absolute",
                // bottom: 0,
                // right: 0,
                // width: "2rem",
                width: "100%",
                backgroundColor: "buttonBg.main",
                textTransform: "none",
                padding: 0.2,
              }}
              size="small"
              disabled={
                isUploading || isNameUploading || uploadedImage?.size > 521000
              }
              loading={isUploading || isNameUploading}
            >
              Güncelle
            </LoadingButton>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default Profile;
