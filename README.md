# COAT PoC API
Proof of Concept API for retrieving cloud cost data.

# How to run locally

`export AWS_PROFILE=MY_AWS_PROFILE && make run-container-local`

Replace MY_AWS_PROFILE with the name of your AWS profile from your AWS configuration.

# Example requests

`curl "http://localhost:3000/api/cloud-cost?billing_period=2025-12&account_name=analytical-platform-compute-production"`