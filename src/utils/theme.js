import { createTheme,  styled, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const theme = createTheme({
  palette: {
    primary: {
      // main: "#254441",
      // main: "#3f4961", // Mystic Dream
      main: "#279AF1", // Celestial Blue

    },
    secondary: {
      main: "#AF1B3F",
      // light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      // contrastText: "#47008F",
    },
    buttonBg: {
      main: "#D5A021",
      secondary: "#279AF1",
    },
  },
  typography: {
    // fontFamily: ["Kalam", "cursive"].join(","),
    // fontFamily: ["Libre Baskerville", "serif"].join(","),
    // fontFamily: ["Roboto", "sans-serif"].join(","),
    // fontFamily: ["Helvetica Neue", "sans-serif"].join(","),
    fontFamily: ["Segoe UI", "sans-serif"].join(","),
    fontSize:12,
  },
});

// mui'nin styled() özelliği ile stillendirme verebiliriz.
export const ReactRouterLink = styled(Link)({
  textDecoration: "none",
  color: "#000",
});

export const TextLineClamp = styled(Typography)({
  display: "-webkit-box",
  textOverflow: "ellipsis",
  overflow: "hidden",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  // whiteSpace:"break-spaces"
});

// renk paletleri
// dark slate gray #254441
// amaranth purple #AF1B3F
// Zomp #43AA8B veya
// Goldenrod #D5A021
// cambridge blue #9DCBBA  butonların hover'ı olabilir.
// Moonstone #66999B  buton renkleri olabilir


export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  // overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
