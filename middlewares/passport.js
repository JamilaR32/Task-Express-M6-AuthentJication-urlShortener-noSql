const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const localstrategy = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        done({ msg: "username Or password is wrong" });
        passwordsMatch = false;
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) {
        done(null, false);
      }
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
module.exports = localstrategy;
