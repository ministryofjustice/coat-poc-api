const AthenaService = require('../services/AthenaService');
const IAMService = require('../services/IAMService');

async function fetchCloudCostDaily(billing_period, line_item_usage_account_name) {
  const IAM_client = new IAMService();

  const IAM_credentials = IAM_client.assumeRole(
    `arn:aws:iam::${process.env.DATA_ACCOUNT_NUMBER}:role/coat-api-${process.env.APP_ENV}-cross-account-role`
  );

  const athena_client = new AthenaService(
    "cur_v2_database",
    process.env.APP_ENV,
    IAM_credentials
  );

  const query = `
    SELECT
      billing_period,
      account_name,
      product_name,
      SUM(daily_cost) AS total_daily_cost
    FROM fct_daily_cost
    WHERE billing_period = '${billing_period}'
      AND account_name = '${line_item_usage_account_name}'
    GROUP BY 
      billing_period, 
      account_name, 
      product_name
    ORDER BY total_cost DESC;
  `;

  const results = await athena_client.runQuery(query);
  return results;
}

module.exports = {
  fetchCloudCostDaily
};