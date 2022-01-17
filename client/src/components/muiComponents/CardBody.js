import { makeStyles } from "@mui/styles";
import React, { useState, useContext } from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { themeContext } from "./ThemeContext";

const useStyles = makeStyles({
  cardContent: {
    height: 75,
    overflow: "auto",
    overflowX: "hidden",
  },
  cardContentExpand: {
    height: 200,
    overflow: "auto",
    overflowX: "hidden",
  },
});

function CardBody({ id, title, desc, username, name }) {
  const { darkMode } = useContext(themeContext);
  const classes = useStyles();
  const history = useHistory();
  const [expanded, setExpand] = useState(false);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "red" }}>
            <Typography variant="h5">
              {name?.length > 0
                ? name.charAt(0).toUpperCase()
                : username.charAt(0).toUpperCase()}
            </Typography>
          </Avatar>
        }
        title={
          <Typography variant="h6" sx={{ maxHeight: 65 }}>
            {expanded
              ? title.length > 61
                ? title.substr(0, 50) + "..."
                : title
              : title.length > 26
              ? title.substr(0, 25) + "..."
              : title}
          </Typography>
        }
        subheader={name?.length > 0 ? `${name}` : `@${username}`}
        sx={{
          bgcolor: darkMode ? "#02475E" : "#8AB6D6",
          paddingBottom: 0.5,
        }}
      />
      <CardContent
        className={expanded ? classes.cardContentExpand : classes.cardContent}
        sx={{
          paddingTop: 0.5,
          paddingBottom: 0,
          paddingLeft: 2,
          paddingRight: 2,
          borderLeft: darkMode ? "solid 2px #02475E" : "solid 2px #8AB6D6",
          borderRight: darkMode ? "solid 2px #02475E" : "solid 2px #8AB6D6",
        }}
      >
        <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
          {desc}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          borderLeft: darkMode ? "solid 2px #02475E" : "solid 2px #8AB6D6",
          borderRight: darkMode ? "solid 2px #02475E" : "solid 2px #8AB6D6",
          borderBottom: darkMode ? "solid 2px #02475E" : "solid 2px #8AB6D6",
        }}
      >
        <Button size="small" onClick={() => history.push(`/pin/${id}`)}>
          View
        </Button>
        <Button size="small" onClick={() => setExpand(!expanded)}>
          {expanded ? "Minimize" : "Expand"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default CardBody;
