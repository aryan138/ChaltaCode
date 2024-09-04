const express = require('express');
const router = express.Router();
const { register, getUsers, updateUser, deleteUser, sendMessage, sendWhatsapp } = require('../controllers/adminController');

router.post('/register', register);
router.post('/send', sendMessage);
router.post('/whatsapp', sendWhatsapp);
router.get('/user-list', getUsers);
router.post('/update/:_id', updateUser);
router.post('/delete/:_id', deleteUser);

module.exports = router;
