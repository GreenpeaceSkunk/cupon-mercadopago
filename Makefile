.PHONY: up
up:
	docker-compose up

.PHONY: up-silent
up-silent:
	docker-compose up -d

.PHONY: up-prod
up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

.PHONY: up-prod-silent
up-prod-silent:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

.PHONY: build
build:
	docker-compose up --build --remove-orphans

.PHONY: build-prod
build-prod:
	docker-compose up --build --remove-orphans

.PHONY: down
down:
	docker-compose down
