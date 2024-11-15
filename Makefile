DOCKER_COMPOSE_LOCAL = docker compose -f docker-compose.local.yml
DOCKER_COMPOSE_PRODUCTION = docker compose -f docker-compose.prod.yml


# Execute the Backend
.PHONY: dev-backend
dev-backend:
	cd Backend && npm start

# Execute the Frontend
.PHONY: dev-frontend
dev-frontend:
	cd Frontend && npm run dev

# Install dependencies

.PHONY: install-backend
install-backend:
	cd Backend && npm install

.PHONY: install-frontend
install-frontend:
	cd Frontend && npm install

# Docker development

.PHONY: docker-dev-up
docker-dev-up:
	${DOCKER_COMPOSE_LOCAL} up --build -d 


.PHONY: docker-dev-down
docker-dev-down:
	${DOCKER_COMPOSE_LOCAL} down

# Docker production

.PHONY: docker-prod-up
docker-prod-up:
	${DOCKER_COMPOSE_PRODUCTION} up --build -d

.PHONY: docker-prod-down
docker-prod-down:
	${DOCKER_COMPOSE_PRODUCTION} down


# Certificates

.PHONY: generate-certificates
generate-certificates:
	cd nginx && ./generate-certificates.sh

