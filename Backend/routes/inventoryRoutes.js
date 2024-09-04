const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authorize = require('../middlewares/authorize');

router.post('/add-item',authorize.verifyJwt, inventoryController.addItem);
router.get('/:inventoryBranch_id',authorize.verifyJwt, inventoryController.getItemsByBranch);
router.put('/:id',authorize.verifyJwt, inventoryController.updateItem);
router.delete('/:id',authorize.verifyJwt, inventoryController.deleteItem);

module.exports = router;
