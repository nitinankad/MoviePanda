import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "use-socketio";
import { addMessage } from "../../actions/playerActions";
import { animateScroll } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import "../../style.css";

const Chatbox = (props) => {
  const state = useSelector(state => state.player);
  const dispatch = useDispatch();
  
  const [chatMessage, setChatMessage] = useState("");
  const [emojiState, setEmojiState] = useState([]);
  const [emojiCount, setEmojiCount] = useState(1);
  const socket = props.socket;
  const playerRef = props.playerRef;

  const messageBox = useRef();

  // laugh, shock, sob, heart, fire
  const emojis = ["https://twemoji.maxcdn.com/v/13.0.0/72x72/1f602.png",
    "https://twemoji.maxcdn.com/v/13.0.0/72x72/1f632.png",
  "https://twemoji.maxcdn.com/v/13.0.0/72x72/1f62d.png",
    "https://twemoji.maxcdn.com/v/13.0.0/72x72/2764.png",
    "https://twemoji.maxcdn.com/v/13.0.0/72x72/1f525.png"];

  const handleChatMessage = (text) => {
    setChatMessage(text);
  };

  useLayoutEffect(() => {
    if (messageBox.current.scrollHeight - messageBox.current.scrollTop - messageBox.current.offsetHeight < 300) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
    
  }, [state.messages]);

  const handleSendMessage = (e) => {
    if (e.key !== "Enter") return;
    // if (!chatState.chatMessage) return;
    if (!chatMessage) return;

    dispatch(addMessage(state.name + ": " + chatMessage));

    socket.emit("chat message", {
      name: state.name,
      roomID: state.roomID,
      message: chatMessage
    });

    e.preventDefault();
    e.value = "";

    // const newState = chatState;
    // newState.chatMessage = "";
    // setChatState(newState);
    setChatMessage("");
  };

  const addEmoji = (emojiID, emojiType, height, width) => {
    console.log("[addEmoji] " + emojiID);
    const newEmojiState = [...emojiState];
    newEmojiState.push({
      emojiID: emojiID,
      emojiType: emojiType,
      height: height,
      width: width
    });
    setEmojiState(newEmojiState);
  }

  const removeEmoji = (emojiID) => {
    const newEmojiState = [...emojiState];
    const index = newEmojiState.find(emoji => emoji.emojiID === emojiID);
    newEmojiState.splice(index, 1);
    setEmojiState(newEmojiState);
  }

  const handleEmojiSpam = (emojiType) => {
    console.log("[handleEmojiSpam] " + emojiCount);
    const height = playerRef.current.wrapper.offsetHeight;
    const width = playerRef.current.wrapper.offsetWidth;
    addEmoji(emojiCount, emojiType, height, width);

    setEmojiCount(emojiCount+1);
  }

  const emojiFinished = (emojiID) => {
    removeEmoji(emojiID);
  };

  const test = (x) => {
    console.log("finished animation ["+x+"]");
    
    // emojiFinished(x);
  }

  // TODO: Get correctly working onAnimationEnd callback
  const spawnEmoji = (data, i) => {
    return (<AnimatePresence key={data.emojiID+i}>
      <motion.div
          animate={{
            y: -data.height,
            scale: 1,
            rotate: 0,
            opacity: 0.1,
            transitionEnd: {
              display: "none"
            }
          }}
          transition={{
            duration: 2.2
          }}
          // onTransitionEnd={() => test(data.emojiID)}
          onAnimationEndCapture={() => test(data.emojiID)}
          // onAnimationComplete={() => emojiFinished(data.emojiID)}
          style={{position: "absolute", left: (data.width-75)+"px", top: data.height+"px"}}
        >
          <img
            width="50"
            height="50"
            src={data.emojiType}
          > 
          </img>
        </motion.div>
    </AnimatePresence>);
    
    };

  useSocket("new message", data => {
    dispatch(addMessage(data.name + ": " + data.message));
  });

  return (
    <>
      <div className={"chathistory"} id="messages" ref={messageBox} style={{marginBottom: "5px"}}>
        {state.messages.map((msg, i) => (
          <div key={i} className={"chatMessage textColor"}>{msg}</div>
        ))}
      </div> 

      {emojiState.map((emoji, i) => spawnEmoji(emoji, i))}

      {/* <div style={{position: "absolute", left: "1463px", top: "763px"}}>
         <img
            width="50"
            height="50"
            src={"https://twemoji.maxcdn.com/v/13.0.0/72x72/1f525.png"}
            style={{marginTop: "10px"}}> 
          </img>
      </div> */}

      <div className={"emojis"}>
        {emojis.map((emoji, i) => (
          <img
            key={emoji}
            onClick={() => handleEmojiSpam(emoji)}
            width="42"
            height="42"
            src={emoji}
            style={{
              marginTop: "3.5%"
            }}> 
          </img>
        ))}
      </div>

      {/* {state.emojis.map((emoji, i) => 
        spawnEmoji(emoji, i)
      )} */}

      <div className={"chatinput"}>
        <textarea
          className={"chatSendMessage"}
          autoComplete="off"
          placeholder="Start a new message"
          value={chatMessage} 
          onChange={e => handleChatMessage(e.target.value)}
          onKeyDown={e => handleSendMessage(e)}
        />
      </div>
    </>
  )
};

export default Chatbox;