const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api/states', require('./routes/api/states'));

app.get('/', (req, res) => {
    res.send('State API is running');
});

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 3500, () => {
            console.log('Server running');
        });
    })
    .catch(err => console.error(err));
