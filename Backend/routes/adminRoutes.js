const express = require('express');
const router = express.Router();
const { register, getUsers, updateUser, deleteUser, sendMessage, sendWhatsapp,loginAdmin,logoutAdmin, createUser, getAllUsersUnderAdmin } = require('../controllers/adminController');
const authorize = require('../middlewares/authorize')
router.post('/register', register);
router.post('/login',loginAdmin);
router.get('/logout',authorize.verifyJwtAdmin,logoutAdmin)
router.post('/create-user',authorize.verifyJwtAdmin,createUser)
router.get('/get-details',authorize.verifyJwtAdmin,getUsers)
router.get('/getAllUsers',authorize.verifyJwtAdmin,getAllUsersUnderAdmin)





router.post('/send', sendMessage);
router.post('/whatsapp', sendWhatsapp);
router.get('/user-list', getUsers);
router.post('/update/:_id', updateUser);
router.post('/delete/:_id', deleteUser);

module.exports = router;
