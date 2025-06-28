import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import logo from "assets/images/logo.png"; // Brand logo
import { Box } from "@mui/material";

const date = new Date().getFullYear();

// Wrapper style for each icon Box
const iconWrapperStyle = {
  padding: "25px !important",
  borderRadius: "50%",
  backgroundColor: "white",
  width: "57px",
  height: "57px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#004c70",
  },
  "&:hover svg": {
    color: "#ffffff !important", // icon turns white on hover
  },
};

// Icon color
const iconStyle = {
  color: "#424242 !important",
};

export default {
  brand: {
    image: logo,
    route: "/",
  },
  socials: [
    {
      icon: (
        <a
          href="https://www.facebook.com/karnatakatravelplaces"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Box sx={iconWrapperStyle}>
            <FacebookIcon sx={iconStyle} />
          </Box>
        </a>
      ),
    },
    {
      icon: (
        <a
          href="https://www.instagram.com/karnatakatravelplaces/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Box sx={iconWrapperStyle}>
            <InstagramIcon sx={iconStyle} />
          </Box>
        </a>
      ),
    },
    {
      icon: (
        <a
          href="https://www.youtube.com/@karnatakatravelplaces8251"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Box sx={iconWrapperStyle}>
            <YouTubeIcon sx={iconStyle} />
          </Box>
        </a>
      ),
    },
  ],
  copyright: (
    <span className="copyright_text">
      @ All copyright {date},{" "}
      <a
        href="https://www.karnatakatravelplaces.com"
        className="karnataka-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Karnataka Travel Places
      </a>
    </span>
  ),
};
