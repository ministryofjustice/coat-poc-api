build-container:
	docker build -t coat-poc-api .

run-container:
	docker build -t coat-poc-api .

	docker run --rm --name coat-poc-api -p 3000:3000 coat-poc-api

run-container-local:
	echo 'configuring AWS credentials' && \
	aws sso login --profile "$$AWS_PROFILE" && \
	eval "$$(aws configure export-credentials --profile "$$AWS_PROFILE" --format env)" && \
	export AWS_REGION=eu-west-2 && \
	echo 'Building and running Docker container' && \
	docker build -t coat-poc-api . && \
	printenv | grep AWS && \
	docker run --rm \
		-e AWS_ACCESS_KEY_ID \
		-e AWS_SECRET_ACCESS_KEY \
		-e AWS_SESSION_TOKEN \
		-e AWS_REGION \
		--name coat-poc-api \
		-p 3000:3000 \
		coat-poc-api

container-vault:
	docker exec -it coat-poc-api /bin/bash

ping-container:
	curl http://localhost:3000/hello