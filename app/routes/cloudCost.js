const express = require('express');
const router = express.Router();
const { getCloudCostDaily } = require('../controllers/cloudCostController');

router.get("/daily", getCloudCostDaily);

module.exports = router;