const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config({ path: '.env.local' });

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));