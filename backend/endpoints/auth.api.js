const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const knex = require("../db/postgres-connection");
const router = express.Router();

router.post("/login", (req, res) => {
  // Input: username & password
  // Check to see if hashed password matches
  // Generate new login token
  // Output: login token, success / fail message

  const username = req.body.username;
  const password = req.body.password;

  knex("users")
    .where({ username: username })
    .first()
    .then(user => {
      if (!user) {
        return res.send({ message: "User does not exist." });
      }

      bcrypt.compare(password, user.password_hash, (err, result) => {
        if (err) throw err;
        if (result !== true) return res.send({ message: "Incorrect password." });
        
        const loginToken = crypto.randomBytes(32).toString("hex");

        knex("users")
          .where({ username: username })
          .update({ auth_token: loginToken })
          .then(() => {
            return res.send({ message: "Success.", token: loginToken })
          });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Error while logging in." });
    });
});

router.post("/register", (req, res) => {
  knex("users")
  .where({ username: req.body.username })
  .first().then((row) => {
    if (row) {
      return res.send({ message: "User already exists." });
    }

    const userId = crypto.randomBytes(16).toString("hex");
    const token = crypto.randomBytes(32).toString("hex");
    // const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) throw err;
      knex("users")
        .insert({
          user_id: userId,
          created_at: new Date(),
          email: req.body.email,
          password_hash: hash,
          google_id: "-1",
          discord_id: "-2",
          twitter_id: "-3",
          avatar_url: "https://pbs.twimg.com/media/C8R28eHVYAASDlE.jpg",
          username: req.body.username,
          auth_token: token,
          rank: "normal",
          subscriber: "normal"
        })
        .then(result => {
          console.log(result);
          return res.send({ message: "Successfully registered.", token: token });
        })
        .catch(err => {
          console.log(err);
          return res.status(500).send({ message: "Error while registering." });
        });
    });
  });
});

// Delete login token from db
router.delete("/logout", (req, res) => {
  const token = req.body.token; 

  // Randomly generate new token to invalidate the previous token
  // Prevents it from being guessed easily
  const logoutToken = crypto.randomBytes(32).toString("hex");

  knex("users")
    .where({ auth_token: token })
    .update({ auth_token: logoutToken })
    .then(() => {
      return res.send({ message: "You have been signed out." });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Error occurred while logging out." });
    });
});

router.get("/user", (req, res) => {
  // Input: token
  // Output: lookup token from db and return user details
  const token = req.body.token;

  knex("users")
    .where({ auth_token: token })
    .first()
    .then(user => {
      if (!user) return res.send({ message: "Invalid token." });

      return res.send({ message: "Success.", username: user.username, avatar: user.avatar_url })
    })
    .catch(err => {
      throw err;
    });
});

module.exports = router;
