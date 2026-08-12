function validateParameters(req_query) {
    const parameters = Object.keys(req_query);

    console.log(`Parameters: ${parameters}`);

    const mandatory_params = ["start_usage_date", "end_usage_date"]

    for (const param of mandatory_params) {
        if (!(parameters.includes(param))) {
            return {
                valid: false, 
                message: `Required parameters missing: ${mandatory_params.join(",")}`};
        };
    };

    const valid_params = [
      "start_usage_date",
      "end_usage_date",
      "account_name",
      "region",
      "environment",
      "business_unit",
      "application",
      "namespace",
      "service_area",
      "owner",
      "product_name"
    ];

    for (const param of parameters) {
        if (!(valid_params.includes(param))) {
            return {valid: false, message: `Invalid parameter: ${param}`};
        };
    };

    if (parameters.length < 3) {
        return {
            valid: false, 
            message: `At least one categorical parameter requred from: ${valid_params.slice(2).join(",")}`};
    }

    return { valid: true }
}

function validateSustainabilityParameters(req_query) {
    const parameters = Object.keys(req_query);

    console.log(`Parameters: ${parameters}`);

    const has_exact = parameters.includes("billing_period");
    const has_range = parameters.includes("start_billing_period") && parameters.includes("end_billing_period");
    const has_partial_range = (parameters.includes("start_billing_period") || parameters.includes("end_billing_period")) && !has_range;

    if (!has_exact && !has_range) {
        return {
            valid: false,
            message: `Required parameters missing: provide either "billing_period" or both "start_billing_period" and "end_billing_period"`};
    };

    if (has_exact && has_range) {
        return {
            valid: false,
            message: `Provide either "billing_period" or a start/end range, not both`};
    };

    if (has_partial_range) {
        return {
            valid: false,
            message: `Both "start_billing_period" and "end_billing_period" are required for a range`};
    };

    const valid_params = [
      "billing_period",
      "start_billing_period",
      "end_billing_period",
      "account_name",
      "region",
      "environment",
      "business_unit",
      "application",
      "namespace",
      "service_area",
      "owner"
    ];

    for (const param of parameters) {
        if (!(valid_params.includes(param))) {
            return {valid: false, message: `Invalid parameter: ${param}`};
        };
    };

    const billing_period_pattern = /^\d{4}-\d{2}$/;
    const period_params = parameters.filter(p =>
      ["billing_period", "start_billing_period", "end_billing_period"].includes(p));

    for (const p of period_params) {
        if (!billing_period_pattern.test(req_query[p])) {
            return {valid: false, message: `${p} must be in YYYY-MM format`};
        };
    };

    return { valid: true }
}

module.exports = {
    validateParameters,
    validateSustainabilityParameters
}