const express = require("express");
const router = express.Router();

// Get all public rooms
router.get("/rooms", (req, res) => {
  // TODO: Pagination for > 10 rooms

  // TODO Get all active rooms, return in a format that's easy for frontend to use
});

// Create a room
router.post("/room", (req, res) => {
  // TODO: Create a new room
  // Generate random room name or use custom one
  // Keep track of host information for validation
  res.send({ body: req.body });
});

// Delete / close an existing room
router.delete("/room", (req, res) => {
  // TODO Delete an existing room
  // Make sure host token is valid and is indeed the host of the room
  // Close the room and (on the frontend) redirect everyone to a different route
});

module.exports = router;
