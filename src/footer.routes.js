import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import logo from "assets/images/logo.png"; // Brand logo
import { Box } from "@mui/material"; // You need Box from MUI

const date = new Date().getFullYear();

const iconWrapperStyle = {
  padding: "12px", // space around the icon
  borderRadius: "50%", // makes it circular
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 4px white",
  transition: "all 0.3s ease",
  "&:hover svg": {
    color: "#344767 !important", // change icon color on hover
  },
};

const iconStyle = {
  color: "white !important", // make the icon itself white
  width: 24,
  height: 24,
};

export default {
  brand: {
    image: logo,
    route: "/",
  },
  socials: [
    {
      icon: (
        <Box sx={iconWrapperStyle}>
          <FacebookIcon sx={iconStyle} />
        </Box>
      ),
      link: "https://www.facebook.com/karnatakatravelplaces",
    },
    {
      icon: (
        <Box sx={iconWrapperStyle}>
          <InstagramIcon sx={iconStyle} />
        </Box>
      ),
      link: "https://www.instagram.com/karnatakatravelplaces/",
    },
    {
      icon: (
        <Box sx={iconWrapperStyle}>
          <YouTubeIcon sx={iconStyle} />
        </Box>
      ),
      link: "https://www.youtube.com/@karnatakatravelplaces8251",
    },
  ],
  copyright: `© All copyright ${date}, Karnataka Travel Places`,
};
