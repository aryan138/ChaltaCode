const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.post('/create', productController.createProduct);
router.get('/getall', productController.getAllProducts);
router.put('/update', productController.updateProduct);
router.delete('/delete/:product_id', productController.deleteProduct);
router.post('/upload-excel', productController.uploadExcel);

module.exports = router;
