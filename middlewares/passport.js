const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const User = require("../models/User");

require("dotenv").config();
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
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

const jwtstrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      console.log("first");
      const userId = payload._id;
      const user = await User.findById(userId);
      if (Date.now() / 1000 > payload.exp) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

module.exports = { localstrategy, jwtstrategy };
