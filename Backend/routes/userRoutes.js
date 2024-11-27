const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const authorize = require('../middlewares/authorize')

router.post("/register",userController.register);
router.post("/sign-in",userController.loginUser);
router.get("/logout",authorize.verifyJwtUser,userController.logoutUser);
router.post("/update-details",authorize.verifyJwtUser,userController.updateUserDetails);
router.get("/get-details",authorize.verifyJwtUser,userController.getDetails);
module.exports = router;