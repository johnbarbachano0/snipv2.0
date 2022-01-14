require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const { Users } = require("../models");
const { validPassword } = require("./miscjs");
const { createTrail } = require("../middlewares/miscjs");

passport.use(
  new LocalStrategy((username, password, done) => {
    Users.findOne({ where: { username: username } })
      .then((user) => {
        if (user === null) {
          return done(null, false);
        } else {
          const isValid = validPassword(password, user.hash);
          isValid.then((valid) => {
            if (valid) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        }
      })
      .catch((err) => {
        return done(err);
      });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      Users.findOne({
        where: { socialId: profile.id, provider: "google" },
      })
        .then((user) => {
          const postUser = {
            username: "google-" + profile?.emails[0]?.value,
            hash: "0123456789ABCDEF",
            socialId: profile?.id,
            name: profile?.displayName,
            email: profile?.emails[0]?.value,
            provider: "google",
            lastLogin: Date.now(),
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
          if (user === null) {
            Users.create(postUser).then((createdUser) => {
              createTrail(
                "Register User/Login thru Google",
                "Register/Login success",
                null,
                createdUser,
                createdUser.id,
                null
              );
              return cb(null, createdUser);
            });
          } else if (user?.dataValues?.id > 0) {
            Users.update(
              { lastLogin: Date.now() },
              { where: { id: user.dataValues.id } }
            );
            createTrail(
              "Login thru Google",
              "Login success",
              null,
              user?.dataValues,
              user?.dataValues?.id,
              null
            );
            return cb(null, user.dataValues);
          } else {
            createTrail(
              "Login thru Google",
              "Login failed",
              null,
              profile,
              profile.id,
              null
            );
            return cb(null, false);
          }
        })
        .catch((error) => {
          createTrail(
            "Login thru Google",
            "Login failed",
            null,
            profile,
            profile.id,
            null
          );
          return cb(error, false);
        });
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      Users.findOne({
        where: { socialId: profile.id, provider: "github" },
      })
        .then((user) => {
          const postUser = {
            username: "github-" + profile?.id,
            hash: "0123456789ABCDEF",
            socialId: profile?.id,
            name: profile?.displayName,
            email: profile?._json?.email,
            provider: "github",
            lastLogin: Date.now(),
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
          if (user === null) {
            Users.create(postUser).then((createdUser) => {
              createTrail(
                "Register User/Login thru Github",
                "Register/Login success",
                null,
                createdUser,
                createdUser.id,
                null
              );
              return cb(null, createdUser);
            });
          } else if (user?.dataValues?.id > 0) {
            Users.update(
              { lastLogin: Date.now() },
              { where: { id: user.dataValues.id } }
            );
            createTrail(
              "Login thru Github",
              "Login success",
              null,
              user?.dataValues,
              user?.dataValues?.id,
              null
            );
            return cb(null, user.dataValues);
          } else {
            createTrail(
              "Login thru Github",
              "Login failed",
              null,
              profile,
              profile.id,
              null
            );
            return cb(null, false);
          }
        })
        .catch((error) => {
          createTrail(
            "Login thru Github",
            "Login failed",
            null,
            profile,
            profile.id,
            null
          );
          return cb(error, false);
        });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      Users.findOne({
        where: { socialId: profile.id, provider: "facebook" },
      })
        .then((user) => {
          const postUser = {
            username: "facebook-" + profile?.id,
            hash: "0123456789ABCDEF",
            socialId: profile?.id,
            name: profile?.displayName,
            email: null,
            provider: "facebook",
            lastLogin: Date.now(),
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
          if (user === null) {
            Users.create(postUser).then((createdUser) => {
              createTrail(
                "Register User/Login thru Facebook",
                "Register/Login success",
                null,
                createdUser,
                createdUser.id,
                null
              );
              return cb(null, createdUser);
            });
          } else if (user?.dataValues?.id > 0) {
            Users.update(
              { lastLogin: Date.now() },
              { where: { id: user.dataValues.id } }
            );
            createTrail(
              "Login thru Facebook",
              "Login success",
              null,
              user?.dataValues,
              user?.dataValues?.id,
              null
            );
            return cb(null, user.dataValues);
          } else {
            createTrail(
              "Login thru Facebook",
              "Login failed",
              null,
              profile,
              profile.id,
              null
            );
            return cb(null, false);
          }
        })
        .catch((error) => {
          createTrail(
            "Login thru Facebook",
            "Login failed",
            null,
            profile,
            profile.id,
            null
          );
          return cb(error, false);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Users.findOne({ where: { id: id } }).then((user, err) => {
    done(err, user);
  });
});
