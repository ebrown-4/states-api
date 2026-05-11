const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Root HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// States routes (NO /api prefix)
app.use('/states', require('./routes/api/states'));

// 404 HTML fallback
app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// MongoDB connection
mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 3500, () =>
            console.log('Server running')
        );
    })
    .catch(err => console.error(err));
