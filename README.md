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

---
**/cloud-cost/daily endpoint**

`curl "http://localhost:3000/api/v1/cloud-cost/daily?start_usage_date=2025-12-01&end_usage_date=2025-12-20&account_name=analytical-platform-compute-production&region=eu-west-2"`

`curl "http://localhost:3000/api/v1/cloud-cost/daily?start_usage_date=2025-12-01&end_usage_date=2025-12-20&business_unit=Platforms&product_name=Amazon%20Simple%20Storage%20Service"`

`curl "http://localhost:3000/api/v1/cloud-cost/daily?start_usage_date=2025-12-01&end_usage_date=2025-12-20&namespace=hmpps-analytics-dev"`

**/cloud-cost/movements endpoint**

`curl "http://localhost:3000/api/v1/cloud-cost/movements?billing_period=2025-10"`

`curl "http://localhost:3000/api/v1/cloud-cost/movements?billing_period=2025-10&movement_type=removed"`

`curl "http://localhost:3000/api/v1/cloud-cost/movements?start_billing_period=2025-09&end_billing_period=2025-11"`

---

# Troubleshooting

#### `getaddrinfo EAI_AGAIN` DNS errors when running locally with Docker

If Athena/AWS requests fail with a DNS resolution error even though your host machine can resolve AWS endpoints fine, Docker's container network may not be inheriting your VPN's DNS resolver.

Check what DNS your host is using vs. the container:
```bash
# from local
nslookup athena.eu-west-2.amazonaws.com

# from docker container
docker exec -it coat-poc-api cat /etc/resolv.conf
```

If they differ, you need to tell Docker's daemon to use your VPN's DNS server instead of its default.

**Docker Desktop:** Settings → Resources → Docker Engine, add a `dns` key to the JSON config:
```json
{
  "dns": ["<your VPN's DNS server IP>"]
}
```
Apply & restart Docker Desktop.

**Other setups (Colima, Rancher Desktop, plain Docker Engine, etc.):** add the same `dns` key to your daemon's `daemon.json` (commonly at `~/.docker/daemon.json` or `/etc/docker/daemon.json` depending on your setup), then restart the Docker daemon.