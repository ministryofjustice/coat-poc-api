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

`curl "http://localhost:3000/api/v1/cloud-cost/daily?start_usage_date=01/12/2025&end_usage_date=20/12/2025&account_name=analytical-platform-compute-production"`