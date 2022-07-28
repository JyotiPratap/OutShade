const express = require('express');
const router = express.Router();
const userController = require("../Controller/userController")
const eventController = require("../Controller/eventController");
const { authorization } = require("../middleware/middleware")

router.post("/createUser", userController.user)
router.post("/login", userController.login);
router.get("/logout", authorization, userController.logout);
router.patch("/updatePassword/:userId", authorization, userController.changePassword);

router.post("/createEvent", eventController.addEvent);
router.post("/inviteEvent/:id", eventController.invite);
router.get("/eventList", eventController.events);
router.patch("/eventChange/:id", eventController.updateEvent);
router.get("/eventsDetails/:id", eventController.details);

module.exports = router;