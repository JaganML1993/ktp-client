// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Presentation page sections
import Weather from "pages/Presentation/sections/Weather";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

// Background image
import bgImage from "assets/images/bg2.jpg";

// Styles
import "index.css";

function Presentation() {
  const socials = [
    {
      icon: <FacebookIcon sx={{ color: "#005596" }} />,
      link: "https://www.facebook.com/karnatakatravelplaces",
    },
    {
      icon: <InstagramIcon sx={{ color: "#005596" }} />,
      link: "https://www.instagram.com/karnatakatravelplaces/",
    },
    {
      icon: <YouTubeIcon sx={{ color: "#005596" }} />,
      link: "https://www.youtube.com/@karnatakatravelplaces8251",
    },
  ];

  return (
    <>
      {/* Top bar with email and social icons */}
      <MKBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1}
        sx={{
          backgroundColor: "#005596",
          color: "#fff",
        }}
      >
        <MKTypography
          color="white"
          sx={{
            fontWeight: "500",
            fontSize: "0.9rem",
            pl: { xs: 0, lg: "50px" },
          }}
        >
          karnatakatravelplaces@gmail.com
        </MKTypography>
        <MKBox display="flex" gap={1.5} sx={{ mr: { xs: 0, lg: "50px" } }}>
          {socials.map(({ icon, link }, index) => (
            <IconButton
              key={index}
              component="a"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: "#fff",
                borderRadius: "50%",
                width: 40,
                height: 40,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
              }}
            >
              {icon}
            </IconButton>
          ))}
        </MKBox>
      </MKBox>

      {/* Navigation Bar */}
      <DefaultNavbar routes={routes} action={null} sticky />

      {/* Hero Section */}
      <MKBox
        minHeight="55vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid container item xs={12} lg={7} justifyContent="center" mx="auto">
            <MKTypography
              variant="h1"
              color="white"
              mt={-6}
              mb={1}
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              Weather Snapshot{" "}
            </MKTypography>
            <MKTypography
              variant="body1"
              color="white"
              textAlign="center"
              px={{ xs: 6, lg: 12 }}
              mt={1}
            >
              Real-Time Weather & Climate Guide
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>

      {/* Weather Section Card */}
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <Weather />
      </Card>

      {/* Footer */}
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
