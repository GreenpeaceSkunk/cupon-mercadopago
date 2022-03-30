.PHONY: up
up:
	docker-compose up

.PHONY: up-silent
up-silent:
	docker-compose up -d

.PHONY: up-production
up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.production.yml up

.PHONY: up-prod-silent
up-prod-silent:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

.PHONY: up-staging
up-staging:
	docker-compose -f docker-compose.yml -f docker-compose.staging.yml up

.PHONY: build
build:
	docker-compose up --build --remove-orphans

.PHONY: build-staging
build-staging:
	docker-compose -f docker-compose.staging.yml up --build --remove-orphans

.PHONY: build-production
build-production:
	docker-compose -f docker-compose.production.yml up --build --remove-orphans

.PHONY: down
down:
	docker-compose down
