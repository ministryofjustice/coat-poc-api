const express = require('express');
const router = express.Router();
const { getCloudCostData } = require('../controllers/cloudCostController');

router.get('/cloud-cost', getCloudCostData);

module.exports = router;