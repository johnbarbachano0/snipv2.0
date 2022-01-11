const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Users } = require("../models");
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

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    const { username } = req.body;
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect(`failure/${username}`);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect(`success/${username}`);
    });
  })(req, res, next);
});

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/login/google/user",
  passport.authenticate("google", {
    failureRedirect: "/auth/login/google/user/failure",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/auth//login/google/user/success");
  }
);

//OAuth success redirecct
router.get("/login/google/user/success", (req, res, next) => {
  console.log("success");
  console.log(req.user);
});

router.get("/login/google/user/failure", (req, res, next) => {
  console.log("failure");
  console.log(req.user);
});

//Successful login redirect
router.get("/success/:username", (req, res, next) => {
  const { username } = req.params;
  Users.findOne({ where: { username: username } }).then((user) => {
    const userId = user.id;
    try {
      createTrail("User Login", "Login success", null, null, userId, null);
      const lastLogin = Date.now();
      Users.update({ lastLogin: lastLogin }, { where: { id: userId } }).then(
        () => {
          Users.findOne({ where: { id: userId } }).then((user) => {
            user.hash = "******";
            const data = {
              user: user,
              session: req.session,
              sessionId: req.sessionID,
            };
            res.json(data);
          });
        }
      );
    } catch (error) {
      createTrail(
        "Login success redirect error",
        "Error during success redirect",
        null,
        null,
        userId,
        error.message
      );
      next(error);
    }
  });
});

//Failed login redirect
router.get("/failure/:username", (req, res, next) => {
  const { username } = req.params;
  Users.findOne({ where: { username: username } }).then((user) => {
    const userId = user.id;
    try {
      createTrail(
        "User Login",
        "Wrong password",
        null,
        { username: username },
        userId,
        null
      );
      const obj = { id: null };
      res.send(obj);
    } catch (error) {
      createTrail(
        "Login fail redirect error",
        "Error during fail redirect",
        null,
        { username: username },
        userId,
        error.message
      );
      next(error);
    }
  });
});

//Logout user
router.get("/logout/:userId", (req, res, next) => {
  try {
    const { userId } = req.params;
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
