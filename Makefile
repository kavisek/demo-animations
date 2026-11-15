# DOCKER / CONTAINER REGISTRY COMMANDS
CONTAINER_NAME=sample-app
PROJECT_ID=sample-proect

.PHONY: build
build:
	docker build -f Dockerfile.dev -t gcr.io/$(PROJECT_ID)/$(CONTAINER_NAME) .

.PHONY: build-prod
build-prod:
	docker build -f Dockerfile -t gcr.io/$(PROJECT_ID)/$(CONTAINER_NAME) .

.PHONY: run
run:
	docker run -it -p 3000:3000 --name ${CONTAINER_NAME} gcr.io/$(PROJECT_ID)/$(CONTAINER_NAME)

.PHONY: run-prod
run-prod: build-prod
	docker run -it -p 80:80 --name ${CONTAINER_NAME} gcr.io/$(PROJECT_ID)/$(CONTAINER_NAME)

.PHONY: push
push: build
	docker push gcr.io/$(PROJECT_ID)/$(CONTAINER_NAME)

.PHONY: attach
attach:
	docker exec -it $(CONTAINER_NAME) /bin/bash