// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// import myImage from "assets/images/Untitled.svg";

function DefaultFooter({ content }) {
  const { socials, copyright } = content;

  return (
    <MKBox
      component="footer"
      sx={{
        // paddingTop: "0px !important",
        marginTop: "0px !important",
        paddingleft: "20px",
        backgroundColor: "#eceeef !important",
      }}
    >
      <Container
        sx={{
          paddingTop: { xs: "10px", md: "43.5px" },
          paddingBottom: { xs: "10px", md: "43.5px" },
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          {/* Left: Copyright Text */}
          <Grid item xs={12} md={6}>
            <MKTypography
              color="black"
              align="left"
              sx={{ marginLeft: { xs: "10px", md: "22.5px" } }}
            >
              {copyright}
            </MKTypography>
          </Grid>

          {/* Right: Social Icons */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              textAlign: { xs: "center", md: "right" },
              mt: { xs: 2, md: 0 },
            }}
          >
            <MKBox display="flex" justifyContent={{ xs: "center", md: "flex-end" }} gap={2}>
              {socials.map(({ icon, link }, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "50%",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                    width: 48,
                    height: 48,
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </MKBox>
          </Grid>
        </Grid>
      </Container>
      <Container
        sx={{
          backgroundColor: "white !important",
          display: { xs: "none", md: "block" }, // Hides on xs (mobile), shows on md+
        }}
      >
        {/* <Grid item xs={12} md={10}>
          <Typography
            color="black"
            align="center"
            component="div"
            display="flex"
            justifyContent="center"
            alignItems="center"
            maxHeight="35px"
          >
            <img src={myImage} alt="Description" className="footer-logo" />
            <span
              style={{
                borderLeft: "1px solid grey",
                height: "25px",
                marginTop: "25px",
                marginBottom: "25px",
                marginRight: "20px",
                display: "inline-block",
              }}
            ></span>
            <span
              style={{
                color: "#454545",
                fontWeight: "400",
                fontFamily: "inherit",
                lineHeight: "1.3rem",
                fontStyle: "inherit",
                fontSize: "16px",
              }}
            >
              Automated page speed optimizations for fast site performance
            </span>
          </Typography>
        </Grid> */}
      </Container>
    </MKBox>
  );
}

DefaultFooter.propTypes = {
  content: PropTypes.shape({
    brand: PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      route: PropTypes.string,
    }),
    socials: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.node,
        link: PropTypes.string,
      })
    ),
    copyright: PropTypes.string,
  }).isRequired,
};

export default DefaultFooter;
