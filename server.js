require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve root HTML page
app.use('/', express.static(path.join(__dirname, 'public')));

// Routes
const statesRoutes = require('./routes/states');
app.use('/states', statesRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// 404 Handler
app.all('*', (req, res) => {
    if (req.accepts('html')) {
        return res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    }
    if (req.accepts('json')) {
        return res.status(404).json({ error: "404 Not Found" });
    }
    res.status(404).type('txt').send("404 Not Found");
});

// Server Listener
const PORT = process.env.PORT || 3600;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
