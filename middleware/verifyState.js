const statesData = require('../models/statesData.json');

const verifyState = (req, res, next) => {
    const code = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === code);

    if (!state) {
        return res.status(400).json({ message: "Invalid state abbreviation parameter" });
    }

    req.stateCode = code;
    next();
};

module.exports = verifyState;
