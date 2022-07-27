const express = require('express');
const router = express.Router();
const usercontroller= require("../Controller/userController")
const ProjectMiddleware= require("../Middleware/middleware")

router.post("/register",usercontroller.user)
router.get("/logout",authorization,userController.logout);
router.patch("/changePassword/:userId",authorization,userController.changePassword);

router.delete('/books/:bookId/review/:reviewId',ProjectMiddleware.authentication,ProjectMiddleware.authorization,reviewcontroller.reviewDelete)

module.exports = router;