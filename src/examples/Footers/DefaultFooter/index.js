// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function DefaultFooter({ content }) {
  const { socials, copyright } = content;

  return (
    <MKBox
      component="footer"
      sx={{
        paddingTop: "35px !important",
        paddingBottom: "35px !important",
        backgroundColor: "#082740 !important",
      }}
    >
      <Container>
        <Grid container justifyContent="space-between" alignItems="center">
          {/* Left: Copyright Text */}
          <Grid item xs={12} md={6}>
            <MKTypography variant="body2" color="white" align="left">
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
