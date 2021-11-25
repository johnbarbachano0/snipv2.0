const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Users, AuditTrail } = require("../models");
const {
  genHash,
  createResponse,
  createTrail,
} = require("../middlewares/miscjs");

//Check if username is already available in user table
router.get("/username/:username", (req, res, next) => {
  const username = req.params.username;
  Users.findOne({ where: { username: username } })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      createTrail(
        "Check Username Availability",
        "Error during check",
        null,
        null,
        req.user.id,
        error.message
      );
      next(error);
    });
});

//Register User
router.post("/register", (req, res, next) => {
  const newUser = req.body;
  Users.findOne({ where: { username: newUser.username } })
    .then(async (user) => {
      if (user) {
        res.json(createResponse("error", "Username already in use"));
      } else {
        const hash = await genHash(newUser.password);
        const postUser = {
          username: newUser.username,
          hash: await hash,
          lastLogin: "1990-01-01 00:00:00",
        };
        Users.create(postUser)
          .then((user) => {
            createTrail(
              "Register User",
              "Register success",
              null,
              user,
              user.id,
              null
            );
            res.json(createResponse("success", "User successfully created."));
          })
          .catch((error) => {
            createTrail(
              "Register User",
              "Register fail",
              null,
              postUser,
              null,
              error.message
            );
            res.json(
              createResponse(
                "error",
                "Error encountered when saving to database."
              )
            );
          });
      }
    })
    .catch((error) => {
      next(error);
    });
});

//Login User
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/failure",
    successRedirect: "/auth/success",
  }),
  (error, req, res, next) => {
    if (error) {
      next(error);
    }
  }
);
//Successful login redirect
router.get("/success", (req, res, next) => {
  try {
    const loginMsg = req.session.flash.message[0];
    const userId = req.user.id;
    createTrail("User Login", loginMsg, null, null, userId, null);
    const lastLogin = Date.now();
    Users.update({ lastLogin: lastLogin }, { where: { id: userId } });
    const respObj = req.user;
    respObj.lastLogin = lastLogin;
    respObj.hash = "******";
    res.send(respObj);
  } catch (error) {
    console.log(error);
    createTrail(
      "Login success redirect",
      "Error during success redirect",
      null,
      null,
      req.user.id,
      error.message
    );
    next(error);
  }
});

//Failed login redirect
router.get("/failure", (req, res, next) => {
  try {
    const loginMsg = req.session.flash.message[0];
    console.log(loginMsg);
    const userId = req.session.flash.userId[0];
    console.log(userId);
    createTrail("User Login", loginMsg, null, null, userId, null);
    const obj = { id: null };
    res.send(obj);
  } catch (error) {
    console.log(error);
    createTrail(
      "Failed login redirect",
      "Error during fail redirect",
      null,
      null,
      req.user.id,
      error.message
    );
    next(error);
  }
});

//Logout user
router.get("/logout", (req, res, next) => {
  try {
    const userId = req.user.id;
    req.logout();
    createTrail("User Logout", "Logout success", null, null, userId, null);
    res.send({ id: null });
  } catch (error) {
    createTrail(
      "User Logout",
      "Logout failed",
      null,
      null,
      userId,
      error.message
    );
  }
});

module.exports = router;
