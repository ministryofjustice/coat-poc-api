const { fetchCloudCostDaily } = require('../models/cloudCostModel');

async function getCloudCostDaily(req, res) {
  try {
    const { billing_period, account_name } = req.query;

    if (!billing_period || !account_name) {
      return res.status(400).json({
        error: 'billing_period and account_name are required parameters'
      });
    }

    const data = await fetchCloudCostData(billing_period, account_name);

    return res.status(200).json({
      billing_period: billing_period,
      account_name: account_name,
      results: data
    });
  } catch (error) {
    console.error('Error retrieving cloud cost data:', error);
    return res.status(500).json({
      error: 'Failed to retrieve cloud cost data',
      details: error.message
    });
  }
}

module.exports = {
  getCloudCostDaily
};