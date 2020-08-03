export const setWelcome = (name, roomID, isHost) => {
  return {
    type: "SET_WELCOME",
    payload: {
      name, roomID, isHost
    }
  };
};

export const setURL = (url) => {
  return {
    type: "SET_URL",
    payload: {
      url
    }
  };
};

export const setPlaying = (isPlaying) => {
  return {
    type: "SET_PLAYING",
    payload: {
      isPlaying
    }
  };
};

export const changeMedia = (hostName, url) => {
  return {
    type: "CHANGE_MEDIA",
    payload: {
      hostName, url
    }
  };
};

export const updateMediaState = (url, playing) => {
  return {
    type: "UPDATE_MEDIA_STATE",
    payload: {
      url, playing
    }
  };
};

export const addMessage = (text) => {
  return {
    type: "ADD_MESSAGE",
    payload: {
      text
    }
  };
};

export const setVolume = (volume) => {
  return {
    type: "SET_VOLUME",
    payload: {
      volume
    }
  };
};

// export const addEmoji = (emojiID, emojiType, height, width) => {
//   return {
//     type: "ADD_EMOJI",
//     payload: {
//       emojiID, emojiType, height, width
//     }
//   };
// };

// export const removeEmoji = (emojiID) => {
//   return {
//     type: "REMOVE_EMOJI",
//     payload: {
//       emojiID
//     }
//   };
// };