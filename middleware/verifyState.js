const statesData = require('../models/statesData.json');

const verifyState = (req, res, next) => {
    const code = req.params.state?.toUpperCase();

    const stateExists = statesData.some(st => st.code === code);

    if (!stateExists) {
        return res.status(404).json({ message: "Invalid state abbreviation parameter" });
    }

    req.stateCode = code;
    next();
};

module.exports = verifyState;
