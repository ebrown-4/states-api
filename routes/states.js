const express = require('express');
const router = express.Router();
const controller = require('../controllers/statesController');
const verifyState = require('../middleware/verifyState');

// GET routes
router.get('/', controller.getAllStates);
router.get('/:state', verifyState, controller.getState);
router.get('/:state/capital', verifyState, controller.getCapital);
router.get('/:state/nickname', verifyState, controller.getNickname);
router.get('/:state/population', verifyState, controller.getPopulation);
router.get('/:state/admission', verifyState, controller.getAdmission);
router.get('/:state/funfact', verifyState, controller.getRandomFunFact);

// POST
router.post('/:state/funfact', verifyState, controller.createFunFact);

// PATCH
router.patch('/:state/funfact', verifyState, controller.updateFunFact);

// DELETE
router.delete('/:state/funfact', verifyState, controller.deleteFunFact);

module.exports = router;
