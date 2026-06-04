function validateParameters(req_query) {
    const parameters = Object.keys(req_query);

    mandatory_params = ["start_usage_date", "end_usage_date"]

    for (const param in mandatory_params) {
        if (!(parameters.includes(param))) {
            return {
                valid: false, 
                message: `Required parameters missing: ${mandatory_params.join(",")}`};
        };
    };

    valid_params = [
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

    for (const param in parameters) {
        if (!(valid_params.includes(param))) {
            return {valid: false, message: `Invalid parameter: ${param}`};
        };
    };

    if (parameters.length < 3) {
        return {
            valid: false, 
            message: `At least one categorical parameter requred from: ${valid_params.slice(2).join(",")}`};
    }

    return true
}