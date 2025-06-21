import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function DefaultFooter({ content }) {
  const { brand, socials, copyright } = content;

  return (
    <MKBox component="footer" py={6} sx={{ backgroundColor: "#f1f2f3" }}>
      <Container>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <MKBox display="flex" alignItems="center">
              <Link to={brand.route}>
                <MKBox component="img" src={brand.image} alt={brand.name} maxWidth="12rem" mr={2} />
              </Link>
              <MKTypography variant="h6" color="text.primary">
                {brand.name}
              </MKTypography>
            </MKBox>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: { xs: "center", md: "right" }, mt: { xs: 3, md: 0 } }}
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

          <Grid item xs={12} mt={4}>
            <MKTypography variant="body2" color="text.primary" align="center">
              {copyright}
            </MKTypography>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

DefaultFooter.propTypes = {
  content: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])).isRequired,
};

export default DefaultFooter;
