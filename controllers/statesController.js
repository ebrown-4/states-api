const statesData = require('../models/statesData.json');
const State = require('../models/State');

// Helper: find state in JSON file
const findState = (code) => {
    return statesData.find(state => state.code === code);
};

// GET all states (merged with MongoDB fun facts)
const getAllStates = async (req, res) => {
    let states = [...statesData];

    const dbStates = await State.find().exec();

    states = states.map(state => {
        const dbState = dbStates.find(s => s.stateCode === state.code);

        // If DB has funfacts, attach them
        if (dbState && dbState.funfacts && dbState.funfacts.length > 0) {
            return { ...state, funfacts: dbState.funfacts };
        }

        // Otherwise remove funfacts entirely (tester requires this)
        const { funfacts, ...rest } = state;
        return rest;
    });

    // Contiguous filter
    if (req.query.contig === 'true') {
        return res.json(states.filter(s => s.code !== 'AK' && s.code !== 'HI'));
    }

    if (req.query.contig === 'false') {
        return res.json(states.filter(s => s.code === 'AK' || s.code === 'HI'));
    }

    res.json(states);
};

// GET single state
const getState = async (req, res) => {
    const code = req.stateCode;
    const state = findState(code);

    const dbState = await State.findOne({ stateCode: code }).exec();

    const result = dbState && dbState.funfacts && dbState.funfacts.length > 0
        ? { ...state, funfacts: dbState.funfacts }
        : state;

    res.json(result);
};

// GET capital
const getCapital = (req, res) => {
    const state = findState(req.stateCode);
    res.json({ state: state.state, capital: state.capital_city });
};

// GET nickname
const getNickname = (req, res) => {
    const state = findState(req.stateCode);
    res.json({ state: state.state, nickname: state.nickname });
};

// GET population
const getPopulation = (req, res) => {
    const state = findState(req.stateCode);
    res.json({ state: state.state, population: state.population.toLocaleString() });
};

// GET admission date
const getAdmission = (req, res) => {
    const state = findState(req.stateCode);
    res.json({ state: state.state, admitted: state.admission_date });
};

// GET random fun fact
const getRandomFunFact = async (req, res) => {
    const code = req.stateCode;
    const dbState = await State.findOne({ stateCode: code }).exec();

    if (!dbState || !dbState.funfacts || dbState.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${code}` });
    }

    const random = dbState.funfacts[Math.floor(Math.random() * dbState.funfacts.length)];
    res.json({ funfact: random });
};

// POST fun facts
const createFunFact = async (req, res) => {
    const code = req.stateCode;
    const { funfacts } = req.body;

    if (!funfacts || !Array.isArray(funfacts)) {
        return res.status(400).json({ message: "State fun facts value must be an array" });
    }

    let state = await State.findOne({ stateCode: code }).exec();

    if (!state) {
        state = await State.create({ stateCode: code, funfacts });
    } else {
        state.funfacts.push(...funfacts);
        await state.save();
    }

    res.json(state);
};

// PATCH fun fact
const updateFunFact = async (req, res) => {
    const code = req.stateCode;
    const { index, funfact } = req.body;

    if (!index || !funfact) {
        return res.status(400).json({ message: "State fun fact index and value are required" });
    }

    const state = await State.findOne({ stateCode: code }).exec();

    if (!state || !state.funfacts || state.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${code}` });
    }

    if (index < 1 || index > state.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${code}` });
    }

    state.funfacts[index - 1] = funfact;
    await state.save();

    res.json(state);
};

// DELETE fun fact
const deleteFunFact = async (req, res) => {
    const code = req.stateCode;
    const { index } = req.body;

    if (!index) {
        return res.status(400).json({ message: "State fun fact index is required" });
    }

    const state = await State.findOne({ stateCode: code }).exec();

    if (!state || !state.funfacts || state.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${code}` });
    }

    if (index < 1 || index > state.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${code}` });
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
