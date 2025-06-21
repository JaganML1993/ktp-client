// footerContent.js
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import logo from "assets/images/logo.png";

const date = new Date().getFullYear();

export default {
  brand: {
    // name: "Karnataka Travel Places",
    image: logo,
    route: "/",
  },
  socials: [
    { icon: <FacebookIcon />, link: "https://www.facebook.com/karnatakatravelplaces" },
    { icon: <InstagramIcon />, link: "https://www.instagram.com/karnatakatravelplaces/" },
    { icon: <YouTubeIcon />, link: "https://www.youtube.com/@karnatakatravelplaces8251" },
  ],
  copyright: `© All copyright ${date}, Karnataka Travel Places`,
};
