import React, { useEffect, useRef } from "react";
import { useSocket } from "use-socketio";
import MediaPlayer from "../components/Room/MediaPlayer";
import Chatbox from "../components/Room/Chatbox";
import "../style.css";

const Room = (props) => {
  const roomID = props.location.pathname;
  const { socket } = useSocket("join room");

  const randomFirst = "Baby,Booble,Bunker,Cuddle,Cutie,Doodle,Foofie,Gooble,Honey,Kissie,Lover,Lovey,Moofie,Mooglie,Moopie,Moopsie,Nookum,Poochie,Pookie,Schmoopie,Schnoogle,Schnookie,Schnookum,Smooch,Smoochie,Smoosh,Snoogle,Snoogy,Snookie,Snookum,Snuggy,Sweetie,Woogle,Woogy,Wookie,Wookum,Wuddle,Wuggy,Wunny,Bumble,Bump,Dip".split(",");
  const randomLast = "Boo,Bunch,Bunny,Cake,Cakes,Cute,Darling,Dumpling,Dumplings,Face,Foof,Goo,Head,Kin,Kins,Lips,Love,Mush,Pie,Pook,Pums,Bumble,Bump,Dip".split(",");

  const playerRef = useRef();

  const choose = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  useEffect(() => {
    let name = prompt("Enter your name");
    while (name === "" || name === undefined) {
      name = prompt("Don't be shy, enter your name :)");
    }
    if (!name)
      name = choose(randomFirst) + "" + choose(randomLast);

    const leaveRoom = (name) => {
      socket.emit("leave room", {
        name: name,
        roomID: roomID
      });
    };

    window.addEventListener("beforeunload", () => leaveRoom(name));

    socket.emit("join room", {
      name: name,
      roomID: roomID
    });

    return () => {
      window.removeEventListener("beforeunload", () => leaveRoom(name));
    };
  }, [roomID, socket, randomFirst, randomLast]);


  return (
    <div className={"container"}>
      <div className={"header textColor"}>
       🐼 MoviePanda
      </div>
      
      <div className={"media"}>
        <MediaPlayer
          socket={socket}
          playerRef={playerRef}
        />
      </div>

      <div className={"chat"}>
        <Chatbox 
          socket={socket}
          playerRef={playerRef}
        />
      </div>
    </div>
  );
};

export default Room;