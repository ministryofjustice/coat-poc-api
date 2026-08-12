const { fetchEmissions } = require('../models/emissionsModel');
const { validateSustainabilityParameters } = require('../validators');

async function getEmissions(req, res) {
  try {
    const params_valid = validateSustainabilityParameters(req.query);

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
      billing_period,
      start_billing_period,
      end_billing_period
    } = req.query;

    const data = await fetchEmissions(
      account_name,
      region,
      environment,
      business_unit,
      application,
      namespace,
      service_area,
      owner,
      billing_period,
      start_billing_period,
      end_billing_period
    );

    return res.status(200).json({
      account_name: account_name,
      results: data
    });
  } catch (error) {
    console.error('Error retrieving emissions data:', error);
    return res.status(500).json({
      error: 'Failed to retrieve emissions data',
      details: error.message
    });
  }
}

module.exports = {
  getEmissions
};