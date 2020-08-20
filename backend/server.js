const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const knex = require("./db/postgres-connection");

const userAuthEndpoints = require("./endpoints/auth.api");
const roomEndpoints = require("./endpoints/rooms.api");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", roomEndpoints);
app.use("/auth", userAuthEndpoints);

var rooms = {
  /*
    roomID: {
      roomName: "",
      roomDescription: "",
      isPrivate: true | false,
      host: {
              username: "",
              avatar: "",
              token: ""
            }, # Token of the host to compare, makes sure that they are the same person that created the room
      hostLastSeen: timestamp, # Update the last seen time for the host whenever the media playback timestamp gets updated. If we haven't seen the host in 10 minutes, close the room.
      mediaURL: "",
      users: [{
          name: username,
          avatar: "url",
        }, ...]
    }
  */
};

// Guest users are assigned a temporary login token for that session only, so that they don't try to spoof usernames

http.listen(process.env.PORT || 8000, function() {
  console.log("Listening on port " +  process.env.PORT);
});

setInterval(() => {
  // Send timestamp update to the hosts of the room
  for (var room in rooms) {
    io.to(room).emit("timestamp update request");
  }

  /*
    TODO: Cycle through the rooms and check if X amount of minutes has elapsed
          in an empty room. If X amount of time has elapsed and nobody has joined
          the room since, close the room session.
  */
}, 5000);


// TODO: Consistency with the name / roomID / isHost user data sent and received
// Example: socket.emit("welcome", ...) should be consistent with the in-memory user model { name: data.name, isHostL: false }

io.on("connection", function(socket) {
  // TODO: Add room names and descriptions
  socket.on("join room", function(data) {
    console.log("Joining room");

    const user = {
      name: data.name,
      isHost: false
    };

    socket.join(data.roomID);
    console.log(rooms);

    socket.emit("welcome", {
      message: "Welcome, "+data.name+"!",
      user: data.name,
      roomID: data.roomID,
      isHost: user.isHost
    });

    if (!user.isHost)
      newUserQueue.push(socket);

    socket.broadcast.to(data.roomID).emit("user joined", {
      user: data.name
    });
  });

  socket.on("leave room", function(data) {
    console.log("Leaving room");

    if (rooms[data.roomID] === undefined) return;

    rooms[data.roomID].users = rooms[data.roomID].users.filter(user => user.name !== data.name);

    if (rooms[data.roomID].users.length == 0)
      delete rooms[data.roomID];

    console.log(data);
    console.log(rooms);

    socket.broadcast.to(data.roomID).emit("user left", {
      user: data.name
    });
    socket.leave(data.roomID);
  });

  socket.on("play media", function(data) {
    console.log("User played media");
    console.log(data);
    
    const hostName = data.name;
    const roomID = data.roomID;
    const timestamp = data.timestamp;


    socket.broadcast.to(roomID).emit("host played", {
      hostName: hostName,
      timestamp: timestamp
    });
  });

  socket.on("pause media", function(data) {
    console.log("User paused media");
    console.log(data);

    const hostName = data.name;
    const roomID = data.roomID;


    socket.broadcast.to(roomID).emit("host paused", {
      hostName: hostName
    });

  });

  socket.on("change media", function(data) {
    console.log("User changed media");
    console.log(data);

    const hostName = data.name;
    const roomID = data.roomID;
    const url = data.url;
    const timestamp = data.timestamp;


    socket.broadcast.to(roomID).emit("host changed media", {
      hostName: hostName,
      url: url,
      timestamp: timestamp
    });
  });

  // Create queue of new users that joined who need a timestamp update and pop them off once the timestamp has been served
  socket.on("send media state", function(data) {
    newUserQueue.forEach(userSocket => {
      // TODO: Handle multiple rooms
      userSocket.emit("current media state", {
        url: data.url,
        timestamp: data.timestamp,
        playing: data.playing
      });
    });

    newUserQueue = [];
  });

  // TODO: Add validation so people don't spoof messages
  // TODO: (for all the others too) Make sure the data is well formatted & has all attributes
  socket.on("chat message", function(data) {
    const name = data.name;
    const roomID = data.roomID;
    const message = data.message;

    console.log("Incoming message");
    console.log(data);

    socket.broadcast.to(roomID).emit("new message", {
      name: name,
      message: message
    });
  });

  socket.on("timestamp update response", function(data) {
    const { url, timestamp, playing, roomID, name } = data;

    // if (timestamp within 3 seconds of end) return;

    console.log("[timestamp update] " + timestamp);

    socket.broadcast.to(roomID).emit("set timestamp update", {
      url: url,
      timestamp: timestamp,
      playing: playing
    });
  });
});
