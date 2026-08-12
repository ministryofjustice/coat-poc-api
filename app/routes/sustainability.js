const express = require('express');
const router = express.Router();
const { getEmissions } = require('../controllers/sustainabilityController');

router.get("/carbon", getEmissions);

module.exports = router;