IMAGE=demo-animations
CONTAINER_NAME=demo-animations

# Sample video for the Video project: the Sintel trailer (CC BY 3.0, Blender Foundation).
# Downloaded on first `make start`; gitignored, so it's never committed.
VIDEO_URL=https://download.blender.org/durian/trailer/sintel_trailer-480p.mp4
VIDEO=frontend_tailwind/public/videos/sample.mp4

# LOCAL DEV (docker compose, hot reloading)
# --renew-anon-volumes swaps in the image's fresh node_modules, so dependency changes take effect
.PHONY: start
start: fetch-video
	docker compose up -d --build --renew-anon-volumes
	@echo "Frontend running at http://localhost:3000 (logs: docker compose logs -f frontend)"

.PHONY: fetch-video
fetch-video: $(VIDEO)

# A file target: only downloads when sample.mp4 is missing
$(VIDEO):
	@mkdir -p $(dir $(VIDEO))
	@echo "Downloading the sample video (Sintel trailer, CC BY 3.0, about 4.4 MB)..."
	curl -fL --retry 3 --progress-bar -o $(VIDEO).part $(VIDEO_URL)
	@mv $(VIDEO).part $(VIDEO)

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
