const express = require("express");
const router = express.Router();
const { createUser, login } = require("../Controllers/userController.js");
const { postMoment, getListOfMoments,updateMoments,deleteMoments } = require("../Controllers/momentController");
const auth = require('../middleware/auth');


// FEATURE-1 User APIs
router.post("/register",createUser);
router.post("/login", login);

// FEATURE-2 Moment API
router.post("/addmoments/:userId",auth.authentication, postMoment);
router.get("/getmomentsList/:userId", getListOfMoments);
router.put("/updatemoments/:userId/:momentId",auth.authentication, updateMoments);
router.delete("/deletemoments/:momentId",auth.authentication, deleteMoments);



module.exports = router;