# COAT PoC API
Proof of Concept API for retrieving cloud cost data.

# How to run locally

```bash
export AWS_PROFILE=MY_AWS_PROFILE && export DATA_ACCOUNT_NUMBER=XXXXXXX && \
make run-container-local
```

- Replace MY_AWS_PROFILE with the name of your AWS profile from your AWS configuration.
- Replace XXXXXXX (value for DATA_ACCOUNT_NUMBER) with the account number of the `coat-development` account.
- Don't forget to launch the Docker daemon on your local machine.

# Example requests

`curl "http://localhost:3000/api/v1/cloud-cost/daily?start_usage_date=2025-12-01&end_usage_date=2025-12-20&account_name=analytical-platform-compute-production&region=eu-west-2"`

`curl "http://localhost:3000/api/v1/cloud-cost/daily?start_usage_date=2025-12-01&end_usage_date=2025-12-20&business_unit=OCTO&product_name=Amazon%20Simple%20Storage%20Service"`

`curl "http://localhost:3000/api/v1/cloud-cost/daily?start_usage_date=2025-12-01&end_usage_date=2025-12-20&namespace=hmpps-analytics-dev"`