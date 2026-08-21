const { fetchCloudCostDaily, fetchCloudCostMovements } = require('../models/cloudCostModel');
const { validateParameters, validateMovementsParameters } = require('../validators');

async function getCloudCostDaily(req, res) {
  try {
    const params_valid = validateParameters(req.query);

    if (!params_valid.valid){
      return res.status(500).json({
        error: 'Invalid request parameters',
        details: params_valid.message
      });
    }

    const { 
      account_name,
      region,
      environment,
      business_unit,
      application,
      namespace,
      service_area,
      owner,
      product_name,
      start_usage_date,
      end_usage_date
    } = req.query;

    const data = await fetchCloudCostDaily(
      account_name,
      region,
      environment,
      business_unit,
      application,
      namespace,
      service_area,
      owner,
      product_name,
      start_usage_date,
      end_usage_date
    );

    return res.status(200).json({
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


//Cost movement controller
async function getCloudCostMovements(req, res) {
  try {
    const params_valid = validateMovementsParameters(req.query);

    if (!params_valid.valid){
      return res.status(400).json({
        error: 'Invalid request parameters',
        details: params_valid.message
      });
    }

    const {
      account_name,
      region,
      environment,
      business_unit,
      application,
      namespace,
      service_area,
      owner,
      product_name,
      charge_type,
      movement_type,
      billing_period,
      start_billing_period,
      end_billing_period
    } = req.query;

    const data = await fetchCloudCostMovements(
      account_name,
      region,
      environment,
      business_unit,
      application,
      namespace,
      service_area,
      owner,
      product_name,
      charge_type,
      movement_type,
      billing_period,
      start_billing_period,
      end_billing_period
    );

    return res.status(200).json({
      account_name: account_name,
      results: data
    });
  } catch (error) {
    console.error('Error retrieving cost movement data:', error);
    return res.status(500).json({
      error: 'Failed to retrieve cost movement data',
      details: error.message
    });
  }
}

module.exports = {
  getCloudCostDaily,
  getCloudCostMovements
};