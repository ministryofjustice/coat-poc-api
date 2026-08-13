const AthenaService = require('../services/AthenaService');
const IAMService = require('../services/IAMService');

function escapeSqlString(value) {
  return value.replace(/'/g, "''");
}

async function fetchEmissions(
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
) {
  // dev: skip role assumption and use the developer's own SSO session directly
  // coat-api-${process.env.APP_ENV}-cross-account-role no longer exists
  let IAM_credentials;

  if (process.env.APP_ENV === 'development') {
    IAM_credentials = undefined;
  } else {
    const IAM_client = new IAMService();
    IAM_credentials = await IAM_client.assumeRole(
      `arn:aws:iam::${process.env.DATA_ACCOUNT_NUMBER}:role/coat-api-${process.env.APP_ENV}-cross-account-role`
    );
  }

  const athena_client = new AthenaService(
    "cloud_optimisation_greenops_datamarts",
    process.env.APP_ENV,
    IAM_credentials
  );

  const query = `
    SELECT
      billing_period,
      ${account_name ? "account_name," : ""}
      ${region ? "product_region_code," : ""}
      ${environment ? "environment," : ""}
      ${business_unit ? "business_unit," : ""}
      ${application ? "tag_application," : ""}
      ${namespace ? "tag_namespace," : ""}
      ${service_area ? "tag_service_area," : ""}
      ${owner ? "tag_owner," : ""}

      sum_total_combined_emissions_tonnes_co2e,
      sum_usage_emissions_tonnes_co2e,
      sum_manufacturing_emissions_tonnes_co2e
    FROM fct_emissions
    WHERE
      ${billing_period
        ? `billing_period = '${escapeSqlString(billing_period)}'`
        : `billing_period BETWEEN '${escapeSqlString(start_billing_period)}' AND '${escapeSqlString(end_billing_period)}'`}
      ${account_name ? `AND account_name = '${escapeSqlString(account_name)}'` : ""}
      ${region ? `AND product_region_code = '${escapeSqlString(region)}'` : ""}
      ${environment ? `AND environment = '${escapeSqlString(environment)}'` : ""}
      ${business_unit ? `AND business_unit = '${escapeSqlString(business_unit)}'` : ""}
      ${application ? `AND tag_application = '${escapeSqlString(application)}'` : ""}
      ${namespace ? `AND tag_namespace = '${escapeSqlString(namespace)}'` : ""}
      ${service_area ? `AND tag_service_area = '${escapeSqlString(service_area)}'` : ""}
      ${owner ? `AND tag_owner = '${escapeSqlString(owner)}'` : ""}
    ORDER BY billing_period;
  `;

  const results = await athena_client.runQuery(query);
  return results;
}

module.exports = {
  fetchEmissions
};