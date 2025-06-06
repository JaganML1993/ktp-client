import React from "react";
import PropTypes from "prop-types";
import { Card, Skeleton, Typography, Box, CardContent, Divider } from "@mui/material";

export function LoadingSkeleton() {
  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box>
            <Skeleton variant="text" width={120} height={40} />
            <Skeleton variant="text" width={180} height={24} />
          </Box>
          <Skeleton variant="circular" width={80} height={80} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Skeleton variant="text" width={100} height={80} />
          <Skeleton variant="text" width={120} height={40} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
      </CardContent>
    </Card>
  );
}

export function ErrorCard({ error }) {
  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: "error.light",
      }}
    >
      <Typography color="error" variant="body1" sx={{ fontWeight: 500 }}>
        Error loading weather data: {error}
      </Typography>
    </Card>
  );
}

ErrorCard.propTypes = {
  error: PropTypes.string.isRequired,
};

export function NoDataCard() {
  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: "warning.light",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        No weather data available
      </Typography>
    </Card>
  );
}
