import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import {
  setWelcome, updateMediaState, setURL,
  setPlaying, changeMedia, addMessage, setVolume 
} from "../../actions/playerActions";
import { useSocket } from "use-socketio";
import {
  IoMdVolumeOff, IoMdVolumeHigh,
  IoMdPlay, IoMdPause
} from "react-icons/io";

const MediaPlayer = (props) => {
  const [inputText, setInputText] = useState("");
  const state = useSelector(state => state.player);
  const dispatch = useDispatch();
  const socket = props.socket;
  // const playerRef = props.playerRef;
  // const player = useRef();  
  const player = props.playerRef;

  useSocket("welcome", data => {
    // const newState = state;
    // newState.messages.push(data.message);
    // newState.name = data.user;
    // newState.roomID = data.roomID;
    // newState.isHost = data.isHost;
    // setState({...newState});
    console.log("Welcomed");
    console.log(data);
    dispatch(addMessage("Welcome to the room!"));
    dispatch(setWelcome(data.user, data.roomID, data.isHost));
  });

  useSocket("user joined", data => {
    // const newState = state.messages;
    // newState.push(data.user + " has joined");
    // setState({...state, messages: newState});

    dispatch(addMessage(data.user + " has joined"));

    if (state.isHost) {
      socket.emit("send media state", {
        url: state.url,
        timestamp: player.current.getCurrentTime(),
        playing: state.playing
      });
    }
  });

  useSocket("user left", data => {
    // const newState = state.messages;
    // newState.push(data.user + " has left");
    // setState({...state, messages: newState});

    dispatch(addMessage(data.user + " has left"));
  });

  useSocket("host played", data => {
    console.log("Host played");
    console.log(data);
    // const newState = state;
    // const message = data.hostName + " has played the media.";
    // newState.messages.push(message);
    // newState.playing = true;
    // setState({...newState});

    dispatch(setPlaying(true));
    dispatch(addMessage(data.hostName + " has played the media"));

    player.current.seekTo(data.timestamp, "seconds");
  });

  useSocket("host paused", data => {
    // const newState = state;
    // const message = data.hostName + " has paused the media.";
    // newState.messages.push(message);
    // newState.playing = false;
    // setState({...newState});

    dispatch(setPlaying(false));
    dispatch(addMessage(data.hostName + " has paused the media"));
  });

  useSocket("host changed media", data => {
    console.log("Changed media");
    console.log(data);
    // const newState = state;
    // const message = data.hostName + " has changed the media.";
    // newState.messages.push(message);
    // newState.url = data.url;
    // setState({...newState});

    dispatch(changeMedia(data.hostName, data.url));
  });

  useSocket("current media state", data => {
    console.log("Updated media state");
    console.log(data);

    // const newState = state;
    // newState.url = data.url;
    // newState.playing = data.playing;
    // setState({...newState});

    dispatch(updateMediaState(data.url, data.playing));

    // console.log(data.timestamp);

    player.current.seekTo(30, "seconds");

    // player.current.seekTo(data.timestamp, "seconds");
  });

  const handleChangeMedia = () => {
    // const newState = state;
    // newState.url = state.mediaInputValue;
    // setState({...newState});

    dispatch(setURL(inputText));

    socket.emit("change media", {
      name: state.name,
      roomID: state.roomID,
      url: state.url
    });
  };

  const handlePlay = () => {
    console.log("Media played");
  
    // const newState = state;
    // newState.playing = true;
    // setState({...newState});

    console.log(state);

    dispatch(setPlaying(true));
    dispatch(addMessage(state.name + " has played the media"));

    socket.emit("play media", {
      name: state.name,
      roomID: state.roomID,
      playing: true,
      timestamp: player.current.getCurrentTime()
    });
  };

  const handlePause = () => {
    console.log("Media paused");
    
    // const newState = state;
    // newState.playing = false;
    // setState({...newState});

    dispatch(setPlaying(false));
    dispatch(addMessage(state.name + " has paused the media"));

    socket.emit("pause media", {
      name: state.name,
      roomID: state.roomID,
      playing: false
    });
  };

  const updateMediaInput = (newLink) => {
    // const newState = state;
    // newState.mediaInputValue = newLink;
    // setState({...newState});
    setInputText(newLink);
  };

  const toggleVolume = () => {
    // const newState = state;
    // newState.volume = 1;
    // setState({...newState});
    
    if (state.volume === 1)
      dispatch(setVolume(0));
    else
      dispatch(setVolume(1));
  };

  const renderControls = () => {
    return (
      <>
        <div style={{color: "white", display: "inline"}}>
          {!state.playing ? <IoMdPlay onClick={() => handlePlay()} size={50} style={{cursor: "pointer"}} /> : <IoMdPause onClick={() => handlePause()} size={50} style={{cursor: "pointer"}} />}
        </div>

        <div style={{float: "right", display: "inline", marginTop: "7px"}}>
          <input type="text" placeholder="Media Direct URL" autoComplete="off" onChange={e => updateMediaInput(e.target.value)} /><button onClick={() => handleChangeMedia()}>Load media</button>
        </div>

        {/* <button onClick={() => handlePlay()}>Play</button>
        <button onClick={() => handlePause()}>Pause</button> */}
        {/* <button onClick={() => unMute()}>Unmute audio</button> */}
        {/* <button onClick={() => {
          console.log("Current time: " + player.current.getCurrentTime());
        }}>get runtime</button> */}
      </>
    );
  }

  return (
    <>
      <div className={"mediaplayer"}>
        <center>
          <ReactPlayer
            ref={player}
            url={state.url}
            playing={state.playing}
            controls={true}
            volume={state.volume}
            width={"100%"}
            height={"82vh"}
          />
        </center>
      </div>

        <div className={"controls"}>
          <div style={{color: "white", display: "inline"}}>
            {state.volume === 0 ?
              <IoMdVolumeOff
                onClick={() => toggleVolume()}
                size={50}
                style={{cursor: "pointer"}}
              /> :
              <IoMdVolumeHigh
                onClick={() => toggleVolume()}
                size={50}
                style={{cursor: "pointer"}}
              />
            }
          </div>

          {state.isHost ? renderControls() : null}
        </div>

        <div className={"userlist"}>
          {/* <div className={"user textColor"}>
            user2
          </div>

          <div className={"user textColor"}>
            user3
          </div> */}
        </div>
      
    </>
  );
};

export default MediaPlayer;