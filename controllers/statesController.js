const State = require('../models/State');
const statesData = require('../models/statesData.json');

const findState = (code) => statesData.find(s => s.code === code);

// GET /states
const getAllStates = async (req, res) => {
    let states = statesData;

    if (req.query.contig === 'true') {
        states = states.filter(s => s.code !== 'AK' && s.code !== 'HI');
    }

    if (req.query.contig === 'false') {
        states = states.filter(s => s.code === 'AK' || s.code === 'HI');
    }

    const dbStates = await State.find().exec();

    const merged = states.map(state => {
        const dbState = dbStates.find(s => s.stateCode === state.code);

        if (dbState && dbState.funfacts && dbState.funfacts.length > 0) {
            return { ...state, funfacts: dbState.funfacts };
        }

        return state;
    });

    res.json(merged);
};

// GET /states/:state
const getState = async (req, res) => {
    const code = req.stateCode;
    const stateInfo = findState(code);

    const dbState = await State.findOne({ stateCode: code }).exec();

    let response = { ...stateInfo };

    if (dbState && dbState.funfacts && dbState.funfacts.length > 0) {
        response.funfacts = dbState.funfacts;
    }

    res.json(response);
};

// GET /states/:state/capital
const getCapital = (req, res) => {
    const state = findState(req.stateCode);
    res.json({
        state: state.state,
        capital: state.capital_city
    });
};

// GET /states/:state/nickname
const getNickname = (req, res) => {
    const state = findState(req.stateCode);
    res.json({
        state: state.state,
        nickname: state.nickname
    });
};

// GET /states/:state/population
const getPopulation = (req, res) => {
    const state = findState(req.stateCode);
    const formattedPopulation = Number(state.population).toLocaleString("en-US");

    res.json({
        state: state.state,
        population: formattedPopulation
    });
};

// GET /states/:state/admission
const getAdmission = (req, res) => {
    const state = findState(req.stateCode);
    res.json({
        state: state.state,
        admitted: state.admission_date
    });
};

// GET /states/:state/funfact
const getRandomFunFact = async (req, res) => {
    const code = req.stateCode;
    const stateInfo = findState(code);

    const dbState = await State.findOne({ stateCode: code }).exec();

    if (!dbState || !dbState.funfacts || dbState.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${stateInfo.state}` });
    }

    const random = dbState.funfacts[Math.floor(Math.random() * dbState.funfacts.length)];
    res.json({ funfact: random });
};

// POST /states/:state/funfact
const createFunFact = async (req, res) => {
    const code = req.stateCode;
    const stateInfo = findState(code);

    if (!req.body.funfacts) {
        return res.status(400).json({ message: "State fun facts value required" });
    }

    if (!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ message: "State fun facts value must be an array" });
    }

    let state = await State.findOne({ stateCode: code }).exec();

    if (!state) {
        state = await State.create({
            stateCode: code,
            funfacts: req.body.funfacts
        });
    } else {
        state.funfacts.push(...req.body.funfacts);
        await state.save();
    }

    res.status(201).json(state);
};

// PATCH /states/:state/funfact
const updateFunFact = async (req, res) => {
    const code = req.stateCode;
    const stateInfo = findState(code);
    const { index, funfact } = req.body;

    if (!index) {
        return res.status(400).json({ message: "State fun fact index value required" });
    }

    if (!funfact) {
        return res.status(400).json({ message: "State fun fact value required" });
    }

    const state = await State.findOne({ stateCode: code }).exec();

    if (!state || !state.funfacts || state.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${stateInfo.state}` });
    }

    if (index < 1 || index > state.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${stateInfo.state}` });
    }

    state.funfacts[index - 1] = funfact;
    await state.save();

    res.json(state);
};

// DELETE /states/:state/funfact
const deleteFunFact = async (req, res) => {
    const code = req.stateCode;
    const stateInfo = findState(code);
    const { index } = req.body;

    if (index === undefined) {
        return res.status(400).json({ message: "State fun fact index value required" });
    }

    const state = await State.findOne({ stateCode: code }).exec();

    if (!state || !state.funfacts || state.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${stateInfo.state}` });
    }

    if (index < 1 || index > state.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${stateInfo.state}` });
    }

    state.funfacts.splice(index - 1, 1);
    await state.save();

    res.json(state);
};

module.exports = {
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getRandomFunFact,
    createFunFact,
    updateFunFact,
    deleteFunFact
};
