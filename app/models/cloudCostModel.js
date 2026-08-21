const AthenaService = require('../services/AthenaService');

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
  // IAM role is currently undefined until we decide to use IRSA role or assuming a different role
  const athena_client = new AthenaService(
    "cur_v2_database",
    process.env.APP_ENV,
    undefined
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

// Cost movement model
function escapeSqlString(value) {
  return value.replace(/'/g, "''");
}

async function fetchCloudCostMovements(
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
) {
  // IAM role is currently undefined until we decide to use IRSA role or assuming a different role
  const athena_client = new AthenaService(
    "cur_v2_database",
    process.env.APP_ENV,
    undefined
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
      ${product_name ? "product_name," : ""}
      ${charge_type ? "charge_type," : ""}

      current_cost,
      prior_cost,
      net_change,
      movement_type
    FROM fct_cost_movement
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
      ${product_name ? `AND product_name = '${escapeSqlString(product_name)}'` : ""}
      ${charge_type ? `AND charge_type = '${escapeSqlString(charge_type)}'` : ""}
      ${movement_type ? `AND movement_type = '${escapeSqlString(movement_type)}'` : ""}
    ORDER BY billing_period;
  `;

  const results = await athena_client.runQuery(query);
  return results;
}

module.exports = {
  fetchCloudCostDaily,
  fetchCloudCostMovements
};