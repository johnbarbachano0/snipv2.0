require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const middlewares = require("../middlewares/errorHandlers");
const db = require("../models");
const passport = require("passport");

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Morgan Helmet Cors
app.use(morgan("common"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // store: sessionStore,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 12, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);

require("../middlewares/strategy");
require("../middlewares/socketio");

app.use(passport.initialize());
app.use(passport.session());

//Routers
const UsersRouter = require("../routes/Users");
app.use("/auth", UsersRouter);
const PinsRouter = require("../routes/Pins");
app.use("/pin", PinsRouter);
const CommentsRouter = require("../routes/Comments");
app.use("/comment", CommentsRouter);
const LinksRouter = require("../routes/Links");
app.use("/link", LinksRouter);
const AuditTrailRouter = require("../routes/AuditTrail");
app.use("/history", AuditTrailRouter);
const ChangelogsRouter = require("../routes/Changelogs");
app.use("/changelogs", ChangelogsRouter);
const MaintenanceRouter = require("../routes/Maintenance");
app.use("/maintenance", MaintenanceRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

//mySQL connection
db.sequelize.sync().then(() => {
  const port = process.env.PORT || 4007;
  app.listen(port, () => {
    console.log(`Listening at port http://localhost:${port}`);
  });
});
