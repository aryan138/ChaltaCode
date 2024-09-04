const express = require('express');
const inventoryBranchController = require('../controllers/inventoryBranchController');
const authorize = require('../middlewares/authorize')
const router = express.Router();

router.post('/add-inventory',authorize.verifyJwt ,inventoryBranchController.addInventoryBranch);
router.get('/get-inventory',authorize.verifyJwt, inventoryBranchController.getInventoryBranches);
router.get('/:branch_id', inventoryBranchController.getItemsUnderBranch);
router.delete('/:inventoryBranch_id', inventoryBranchController.deleteInventoryBranch);

module.exports = router;
