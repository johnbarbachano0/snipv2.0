const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Users } = require("../models");
const { validPassword } = require("./miscjs");

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      req.flash("message", "");
      Users.findOne({ where: { username: username } })
        .then((user) => {
          if (user === null) {
            return done(
              null,
              false,
              req.flash("message", "User does not exist")
            );
          } else {
            const isValid = validPassword(password, user.hash);
            isValid.then((valid) => {
              if (valid) {
                return done(
                  null,
                  user,
                  req.flash("message", "Password is correct")
                );
              } else {
                return done(
                  null,
                  false,
                  req.flash("message", "Incorrect password"),
                  req.flash("userId", user.id)
                );
              }
            });
          }
        })
        .catch((err) => {
          return done(err);
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
