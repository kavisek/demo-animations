IMAGE=demo-animations
CONTAINER_NAME=demo-animations

# LOCAL DEV (docker compose, hot reloading)
.PHONY: start
start:
	docker compose up -d --build
	@echo "Frontend running at http://localhost:3000 (logs: docker compose logs -f frontend)"

.PHONY: stop
stop:
	docker compose down

.PHONY: logs
logs:
	docker compose logs -f frontend

.PHONY: attach
attach:
	docker compose exec frontend sh

# PRODUCTION IMAGE
.PHONY: build-prod
build-prod:
	docker build -f Dockerfile -t $(IMAGE):prod .

.PHONY: run-prod
run-prod: build-prod
	docker run --rm -it -p 127.0.0.1:3000:3000 --name $(CONTAINER_NAME)-prod $(IMAGE):prod
