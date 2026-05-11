const express = require('express');
const router = express.Router();
const verifyState = require('../../middleware/verifyState');
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates);

router.route('/:state')
    .get(verifyState, statesController.getState);

router.route('/:state/capital')
    .get(verifyState, statesController.getCapital);

router.route('/:state/nickname')
    .get(verifyState, statesController.getNickname);

router.route('/:state/population')
    .get(verifyState, statesController.getPopulation);

router.route('/:state/admission')
    .get(verifyState, statesController.getAdmission);

router.route('/:state/funfact')
    .get(verifyState, statesController.getRandomFunFact)
    .post(verifyState, statesController.createFunFact)
    .patch(verifyState, statesController.updateFunFact)
    .delete(verifyState, statesController.deleteFunFact);

module.exports = router;
