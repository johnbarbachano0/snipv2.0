import React from "react";
import NavBar from "../../components/muiComponents/NavBar";
import ScrollToTop from "../../components/muiComponents/ScrollToTop";
import { Box, Grid, Typography } from "@mui/material";
import { SiMaterialui } from "react-icons/si";
import { RiReactjsLine } from "react-icons/ri";
import { IoLogoNodejs } from "react-icons/io";
import { GrMysql } from "react-icons/gr";
import FavoriteIcon from "@mui/icons-material/Favorite";

function About() {
  const page = "about";
  return (
    <>
      <NavBar isLoading={false} page={page} />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">
          Built with{" "}
          <FavoriteIcon
            style={{
              fontSize: 40,
              position: "relative",
              top: 10,
              color: "red",
            }}
          />{" "}
          using MERN and MaterialUI.
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignContent="center"
          spacing={2}
          sx={{ marginTop: 1, spacing: 1 }}
        >
          <Grid item>
            <GrMysql style={{ fontSize: 70 }} />
            <Box>MySQL</Box>
          </Grid>
          <Grid item>
            <Box
              style={{
                fontSize: 50,
                backgroundColor: "#D8E3E7",
                paddingBottom: 2,
              }}
            >
              ex
            </Box>
            <Box>ExpressJS</Box>
          </Grid>
          <Grid item>
            <RiReactjsLine style={{ fontSize: 70 }} />
            <Box>ReactJS</Box>
          </Grid>
          <Grid item>
            <IoLogoNodejs style={{ fontSize: 70 }} />
            <Box>NodeJS</Box>
          </Grid>
        </Grid>
        <span style={{ fontStyle: "italic" }}>~and~</span>
        <Box>
          <SiMaterialui style={{ fontSize: 70 }} />
          <Box>Material UI</Box>
        </Box>
      </Box>
      <ScrollToTop />
    </>
  );
}

export default About;
