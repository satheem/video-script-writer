import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 2,
        backgroundColor: "#f8f9fa",
        mt: 4,
      }}
    >
      <Typography variant="body2">
        Developed by{" "}
        <Link 
          href="https://github.com/satheem" // Replace with your actual link
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ fontWeight: "bold", color: "primary.main", textDecoration: "none" }}
        >
          Satheem
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
