require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const { Users, Socials } = require("../models");
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
      console.log("profile");
      console.log(profile);
      Socials.findOne({
        where: { socialId: profile.id, provider: "google" },
      }).then((user) => {
        console.log("user");
        console.log(user?.dataValues);
        console.log(user?.dataValues?.id > 0);
        if (user === null) {
          const postUser = {
            socialId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "google",
            lastLogin: "1990-01-01 00:00:00",
          };
          const created = Socials.create(postUser).then((createdUser) => {
            createTrail(
              "Register User thru Google",
              "Register success",
              null,
              createdUser,
              createdUser.socialId,
              null
            );
          });
          console.log("created");
          console.log(created);
          return cb(null, created);
        } else if (user?.dataValues?.id > 0) {
          console.log(user?.dataValues);
          console.log("user?.dataValues");
          return cb(null, user.dataValues);
        } else {
          return cb(null, false);
        }
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
