const express = require('express');
const router = express.Router();
const { getCloudCostDaily, getCloudCostMovements } = require('../controllers/cloudCostController');

router.get("/daily", getCloudCostDaily);
router.get("/movements", getCloudCostMovements);

module.exports = router;