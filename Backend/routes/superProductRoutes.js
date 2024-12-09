const express = require('express');
const productController = require('../controllers/superProductController');
const authorize = require('../middlewares/authorize');
const router = express.Router();

router.post('/create',authorize.verifyJwtAdmin, productController.createProduct);
router.get('/getall',authorize.verifyJwtAdmin, productController.getAllProducts);
router.put('/update/:product_id',authorize.verifyJwtAdmin, productController.updateProduct);

router.delete('/delete/:product_id',authorize.verifyJwtAdmin, productController.deleteProduct);
router.post('/upload-excel',authorize.verifyJwtAdmin, productController.uploadExcel);

module.exports = router;
