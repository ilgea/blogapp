import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { RxAvatar } from "react-icons/rx";
import BlogIcon from "../assets/blog-icon.png";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { ReactRouterLink } from "../utils/theme";
import { logoutUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutAndClose = () => {
    dispatch(logoutUser());
    setAnchorEl(null);
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate("/")}
          >
            <img
              src={BlogIcon}
              alt=""
              style={{ width: "40px", borderRadius: "50%" }}
            />
          </IconButton>
          <Typography
            onClick={() => navigate("/")}
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              fontSize: "1.5rem",
              letterSpacing: "1.5px",
              fontWeight: "bold",
            }}
          >
            Blogcu
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <RxAvatar style={{ fontSize: "35px" }} />
            </IconButton>
            {/* currentUser 'di önceden */}
            {user ? (
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <ReactRouterLink to={"/new-blog"}>
                  <MenuItem onClick={handleClose} divider={true}>
                    <Typography>Yeni Blog</Typography>
                  </MenuItem>
                </ReactRouterLink>
                <ReactRouterLink to={"/profile"}>
                  <MenuItem onClick={handleClose} divider={true} >
                    <Typography>Profil</Typography>
                  </MenuItem>
                </ReactRouterLink>
                <MenuItem onClick={handleLogoutAndClose} sx={{}}>
                  <Typography>Çıkış yap</Typography>
                </MenuItem>
              </Menu>
            ) : (
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <ReactRouterLink to={"/login"}>
                  <MenuItem onClick={handleClose}>
                    <Typography>Giriş yap</Typography>
                  </MenuItem>
                </ReactRouterLink>
                <ReactRouterLink to={"/register"}>
                  <MenuItem onClick={handleClose}>
                    <Typography>Kayıt ol</Typography>
                  </MenuItem>
                </ReactRouterLink>
              </Menu>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
