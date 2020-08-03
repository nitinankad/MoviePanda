const initialState = {
  name: "",
  roomID: "",
  isHost: false,
  url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
  playing: false,
  volume: 0,
  messages: [],
  userlist: [],
  emojis: []
};

const playerReducer = (state=initialState, action) => {
  switch (action.type) {
    case "SET_WELCOME": {
      const { name, roomID, isHost } = action.payload;
      const newState = state;
      newState.name = name;
      newState.roomID = roomID;
      newState.isHost = isHost;
      return {...newState};
    }

    case "SET_URL": {
      const { url } = action.payload;
      const newState = state;
      newState.url = url;
      return {...newState};
    }

    case "SET_PLAYING": {
      const { isPlaying } = action.payload;
      const newState = state;
      newState.playing = isPlaying;
      return {...newState};
    }

    case "CHANGE_MEDIA": {
      const { hostName, url } = action.payload;
      const newState = state;
      newState.url = url;
      newState.messages.push(hostName + " has changed the media");
      return {...newState};
    }

    case "UPDATE_MEDIA_STATE": {
      const { url, playing } = action.payload;
      const newState = state;
      newState.url = url;
      newState.playing = playing;
      console.log(newState);
      return {...newState};
    }

    case "ADD_MESSAGE": {
      const { text } = action.payload;
      const newState = state;
      newState.messages.push(text);
      return {...newState};
    }

    case "SET_VOLUME": {
      const { volume } = action.payload;
      const newState = state;
      newState.volume = volume;
      return {...newState};
    }

    // case "ADD_EMOJI": {
    //   const { emojiID, emojiType, height, width } = action.payload;
    //   const newState = state;
    //   newState.emojis.push({
    //     emojiID: emojiID,
    //     emojiType: emojiType,
    //     height: height,
    //     width: width
    //   });
    //   return {...newState};
    // }

    // case "REMOVE_EMOJI": {
    //   const { emojiID } = action.payload;
    //   const newState = state;
    //   const index = newState.emojis.find(emoji => emoji.emojiID === emojiID);
    //   newState.emojis.splice(index, 1);
    //   return {...newState};
    // }

    default:
      return state;
  }
};

export default playerReducer;