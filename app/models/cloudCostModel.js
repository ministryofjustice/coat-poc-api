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
      ${account_name ? "account_name," : ""}
      ${region ? "product_region_code," : ""}
      ${environment ? "environment," : ""}
      ${business_unit ? "business_unit," : ""}
      ${application ? "tag_application," : ""}
      ${namespace ? "tag_namespace," : ""}
      ${service_area ? "tag_service_area," : ""}
      ${owner ? "tag_owner," : ""}
      ${product_name ? "product_name," : ""}

      usage_date,

      SUM(daily_cost) AS total_daily_cost
    FROM fct_daily_cost
    WHERE 
      usage_date BETWEEN DATE '${start_usage_date}' AND DATE '${end_usage_date}'
      ${account_name ? `AND account_name = '${account_name}'` : ""}
      ${region ? `AND product_region_code = '${region}'` : ""}
      ${environment ? `AND environment = '${environment}'` : ""}
      ${business_unit ? `AND business_unit = '${business_unit}'` : ""}
      ${application ? `AND tag_application = '${application}'` : ""}
      ${namespace ? `AND tag_namespace = '${namespace}'` : ""}
      ${service_area ? `AND tag_service_area = '${service_area}'` : ""}
      ${owner ? `AND tag_owner = '${owner}'` : ""}
      ${product_name ? `AND product_name = '${product_name}'` : ""}
    GROUP BY 
      ${account_name ? "account_name," : ""}
      ${region ? "product_region_code," : ""}
      ${environment ? "environment," : ""}
      ${business_unit ? "business_unit," : ""}
      ${application ? "tag_application," : ""}
      ${namespace ? "tag_namespace," : ""}
      ${service_area ? "tag_service_area," : ""}
      ${owner ? "tag_owner," : ""}
      ${product_name ? "product_name," : ""}

      usage_date
    ORDER BY usage_date;
  `;

  const results = await athena_client.runQuery(query);
  return results;
}

module.exports = {
  fetchCloudCostDaily
};