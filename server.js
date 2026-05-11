const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Simple API check
app.get('/api', (req, res) => {
    res.json({ message: "API is running" });
});

// Routes
app.use('/api/states', require('./routes/api/states'));

// MongoDB connection (Mongoose 7+ — NO options allowed)
mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 3500, () =>
            console.log('Server running')
        );
    })
    .catch(err => console.error(err));
