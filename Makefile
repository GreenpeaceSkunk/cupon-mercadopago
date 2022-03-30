.PHONY: up-dev
up-dev:
	docker-compose -f docker-compose.dev.yml up

.PHONY: up-dev-silent
up-dev-silent:
	docker-compose -f docker-compose.dev.yml up -d

.PHONY: up-test
up-test:
	docker-compose -f docker-compose.test.yml up

.PHONY: up-test-silent
up-test-silent:
	docker-compose -f docker-compose.test.yml up -d

.PHONY: up-prod
up-prod:
	docker-compose -f docker-compose.prod.yml up

.PHONY: up-prod-silent
up-prod-silent:
	docker-compose -f docker-compose.prod.yml up -d

.PHONY: build-dev
build-dev:
	docker-compose -f docker-compose.dev.yml up --build --remove-orphans

.PHONY: build-dev-silent
build-dev-silent:
	docker-compose -f docker-compose.dev.yml up -d --build --remove-orphans

.PHONY: build-test
build-test:
	docker-compose -f docker-compose.test.yml up --build --remove-orphans

.PHONY: build-test-silent
build-test-silent:
	docker-compose -f docker-compose.test.yml up -d --build --remove-orphans

.PHONY: build-prod
build-prod:
	docker-compose -f docker-compose.prod.yml up --build --remove-orphans

.PHONY: build-prod-silent
build-prod-silent:
	docker-compose -f docker-compose.prod.yml up -d --build --remove-orphans

.PHONY: down
down:
	docker-compose down
