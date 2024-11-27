const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
// Use the routes defined in the routes folder 
const adminRoutes = require('./routes/adminRoutes');
const branchRoutes = require('./routes/branchRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const inventoryBranchRoutes = require('./routes/inventoryBranchRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const superProductRoutes = require('./routes/superProductRoutes.js');
const {verifyToken} = require('./middlewares/authorize.js');
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser())
app.use(cors({origin: 'http://localhost:3001',
    credentials: true,}));


// Database connection
const dbConnect = require('./middlewares/dB.js');
dbConnect();

// Routes
app.get('/', (req, res) => {
    res.send('Hello Aryan');
});

app.get('/home', (req, res) => {
    res.send('helloooo');
});

//protected routes api
app.get('/api/getRole',verifyToken, (req, res) => {
    const role = req.user.role; // Extract role from the decoded token
    res.status(200).json({ role });
});



app.use('/admin', adminRoutes);
app.use('/branch', branchRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/inventorybranch', inventoryBranchRoutes);
app.use('/user', userRoutes);
app.use('/order',orderRoutes);
app.use('/products', productRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/superproducts', superProductRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
