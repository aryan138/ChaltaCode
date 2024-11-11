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



// app.use('/admin', adminRoutes);
app.use('/branch', branchRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/inventorybranch', inventoryBranchRoutes);
app.use('/user', userRoutes);
app.use('/order',orderRoutes);
app.use('/products', productRoutes);
// Start the server
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
