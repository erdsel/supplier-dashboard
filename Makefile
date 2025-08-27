# Makefile for Lonca Vendor Dashboard

# Development komutları
.PHONY: dev
dev:
	@echo "Starting development environment with hot-reload..."
	docker-compose -f docker-compose.dev.yml up

.PHONY: dev-build
dev-build:
	@echo "Building development containers..."
	docker-compose -f docker-compose.dev.yml build

.PHONY: dev-down
dev-down:
	@echo "Stopping development environment..."
	docker-compose -f docker-compose.dev.yml down

.PHONY: dev-logs
dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Production komutları
.PHONY: prod
prod:
	@echo "Starting production environment..."
	docker-compose up -d

.PHONY: prod-build
prod-build:
	@echo "Building production containers..."
	docker-compose build

.PHONY: prod-down
prod-down:
	@echo "Stopping production environment..."
	docker-compose down

# Genel komutlar
.PHONY: clean
clean:
	@echo "Removing all containers and volumes..."
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v

.PHONY: restart
restart: dev-down dev

# Veritabanı komutları
.PHONY: import-data
import-data:
	@echo "Importing data to MongoDB..."
	mongoimport --db lonca --collection vendors --file vendors.json --jsonArray
	mongoimport --db lonca --collection parent_products --file parent_products.json --jsonArray
	mongoimport --db lonca --collection orders --file orders.json --jsonArray

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make dev          - Start development environment with hot-reload"
	@echo "  make dev-build    - Build development containers"
	@echo "  make dev-down     - Stop development environment"
	@echo "  make dev-logs     - Show development logs"
	@echo "  make prod         - Start production environment"
	@echo "  make prod-build   - Build production containers"
	@echo "  make prod-down    - Stop production environment"
	@echo "  make clean        - Remove all containers and volumes"
	@echo "  make restart      - Restart development environment"
	@echo "  make import-data  - Import data to MongoDB"
	@echo "  make help         - Show this help message"