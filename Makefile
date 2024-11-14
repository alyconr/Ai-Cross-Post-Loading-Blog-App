DOCKER_COMPOSE_LOCAL = docker compose -f docker-compose.local.yml


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

# Docker

.PHONY: docker-dev-up
docker-dev-up:
	${DOCKER_COMPOSE_LOCAL} up --build -d 
	