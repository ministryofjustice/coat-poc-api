const AthenaService = require('../services/AthenaService');
const IAMService = require('../services/IAMService');

async function fetchCloudCostDaily(
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
) {
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
      account_name,
      product_name,
      SUM(daily_cost) AS total_daily_cost
    FROM fct_daily_cost
    WHERE account_name = '${account_name}'
    GROUP BY
      account_name, 
      product_name
    ORDER BY total_daily_cost DESC;
  `;

  const results = await athena_client.runQuery(query);
  return results;
}

module.exports = {
  fetchCloudCostDaily
};