require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Users } = require("../models");
const {
  genHash,
  createResponse,
  createTrail,
} = require("../middlewares/miscjs");
const { Op } = require("sequelize");

//Check if username is already available in user table
router.get("/username/:username", (req, res, next) => {
  const username = req.params.username;
  Users.findOne({ where: { username: username } })
    .then((response) => {
      const user = response?.dataValues || [];
      if (user && user?.status === true) {
        res.json({ status: false, message: "existing" });
      } else if (user && user?.status === false) {
        res.json({ status: false, message: "inactive" });
      } else {
        res.json({ status: true, message: "available" });
      }
    })
    .catch((error) => {
      createTrail(
        "Check Username Availability",
        "Error during check",
        null,
        null,
        req?.user?.id,
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
          provider: "snip",
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

// Google OAuth2.0 Login
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/login/google/user",
  passport.authenticate("google", {
    failureRedirect: `/login/google/error`,
  }),
  function (req, res) {
    // Successful authentication, redirect home
    const user = JSON.stringify({ ...req.user, hash: "****" });
    const session = JSON.stringify(req.session);
    res.redirect(
      `${process.env.REACT_APP_CLIENT}/login/google/success?user=${user}&sessionID=${req.sessionID}&session=${session}`
    );
  }
);

// Github OAuth2.0 Login
router.get(
  "/login/github",
  passport.authenticate("github", { scope: ["user"] })
);

router.get(
  "/login/github/user",
  passport.authenticate("github", {
    failureRedirect: "/login/github/error",
  }),
  function (req, res) {
    // Successful authentication, redirect home
    const user = JSON.stringify({ ...req.user, hash: "****" });
    const session = JSON.stringify(req.session);
    res.redirect(
      `${process.env.REACT_APP_CLIENT}/login/github/success?user=${user}&sessionID=${req.sessionID}&session=${session}`
    );
  }
);

// Facebook OAuth2.0 Login
router.get("/login/facebook", passport.authenticate("facebook"));

router.get(
  "/login/facebook/user",
  passport.authenticate("facebook", {
    failureRedirect: "/login/facebook/error",
  }),
  function (req, res) {
    // Successful authentication, redirect home
    const user = JSON.stringify({ ...req.user, hash: "****" });
    const session = JSON.stringify(req.session);
    res.redirect(
      `${process.env.REACT_APP_CLIENT}/login/facebook/success?user=${user}&sessionID=${req.sessionID}&session=${session}`
    );
  }
);

//Social Failure Redirect
router.get("/login/error", (req, res, error) => {
  const authError = JSON.stringify({
    error: error.name,
    message: error.message,
  });
  res.redirect(
    `${process.env.REACT_APP_CLIENT}/login/oauth/error?authError=${authError}`
  );
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

//Get All Users
router.get("/users", (req, res, next) => {
  const { query } = req.query;
  const queryObj = { [Op.substring]: query };
  Users.findAll({
    where: {
      [Op.or]: [
        { username: queryObj },
        { provider: queryObj },
        { role: queryObj },
        { email: queryObj },
        { status: queryObj },
      ],
    },
    order: [["createdAt", "DESC"]],
  })
    .then((users) => {
      const newUsers = users.map((user) => {
        return { ...user.dataValues, hash: "****" };
      });
      res.json(newUsers);
    })
    .catch((error) => {
      createTrail(
        "Get All Users",
        "Error during get all users",
        null,
        null,
        req.user.id,
        error.message
      );
      next(error);
    });
});

//Update User (this include delete=disable access)
router.patch("/users/:id", (req, res, next) => {
  Users.findByPk(req.params.id).then((prevValue) => {
    const userId = prevValue.id;
    Users.update(req.body.data, { where: { id: req.params.id } })
      .then((response) => {
        return Users.findOne({ where: { id: req.params.id } });
      })
      .then((newValue) => {
        createTrail(
          "Update User",
          "Update success",
          prevValue,
          newValue,
          userId,
          null
        );
        res.send(true);
      })
      .catch((error) => {
        createTrail(
          "Update User",
          "Error during user update",
          prevValue,
          req.body.data,
          userId,
          error.message
        );
        res.send(false);
      });
  });
});

module.exports = router;
