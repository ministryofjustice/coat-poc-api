build-container:
	docker build -t coat-poc-api .

run-container:
	docker build -t coat-poc-api .

	docker run --rm --name coat-poc-api -p 3000:3000 coat-poc-api

container-vault:
	docker exec -it coat-poc-api /bin/bash

ping-container:
	curl http://localhost:3000/hello