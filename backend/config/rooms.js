class Rooms {
  constructor() {
    this.rooms = {
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
        users: {
                username: {
                  name: username,
                  avatar: "url",
                },
                ...
              }
        }
      */
    };
  }

  // Create a new room from the form request
  createRoom() {
    // Create room object, add to this.rooms
    // Set the host info for the room
  }

  deleteRoom(roomID) {
    delete this.rooms[roomID];
  }

  getAllRooms() {

  }

  addUser(roomID, userInfo) {
    const name = userInfo.name;
    const avatar = userInfo.avatar;

    this.rooms[roomID].users[name] = {
      name: name,
      avatar: avatar
    };
  }

  removeUser(roomID, userInfo) {
    const name = userInfo.name;

    delete this.rooms[roomID].users[name];
  }

  setMediaURL(mediaURL) {

  }

  getHost(roomID) {

  }

  updateHostLastSeen(roomID) {

  }

  getRoomThumbnail(roomID) {
    
  }
};

module.exports = new Rooms();
