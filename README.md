# Employee Management System – CI/CD Pipeline

A simple college-friendly Employee Management System using FastAPI, React, SQLite, Jenkins, Docker and Kubernetes.

## Features
- JWT authentication
- Employee CRUD
- FastAPI Swagger documentation
- Automated tests with Pytest
- Jenkins CI/CD pipeline
- Versioned Docker images
- Docker Compose
- Kubernetes deployment
- Kubernetes health checks
- Basic security/dependency validation

## Default Login
Username: `admin`
Password: `admin123`

The backend creates the database automatically. Register the demo user through:
`POST /auth/register`

## Run Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend: http://localhost:8000  
Swagger: http://localhost:8000/docs  
Health: http://localhost:8000/health

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Docker

From the project root:

```bash
docker compose -f docker/docker-compose.yml up --build
```

Frontend: http://localhost:8080  
Backend: http://localhost:8000

## Tests

```bash
cd backend
python -m pytest -v
```

## Jenkins

Create a Jenkins Pipeline job connected to the Git repository.

The Jenkinsfile performs:
1. Checkout
2. Backend automated tests
3. Frontend build validation
4. Dependency/security validation
5. Docker image build
6. Artifact version validation
7. Kubernetes deployment
8. Deployment health/status check

## Kubernetes

The manifests assume Docker images named:

- employee-backend:1.0.0
- employee-frontend:1.0.0

For Minikube, build the images inside Minikube's Docker environment before applying the manifests.

```bash
kubectl apply -f kubernetes/
kubectl get pods -n employee-system
kubectl get services -n employee-system
```

## Project Requirement Mapping

| Requirement | Implementation |
|---|---|
| Authentication | JWT |
| CRUD | Employee API + React UI |
| CI/CD | Jenkinsfile |
| Automated testing | Pytest |
| Versioned artifacts | VERSION + Docker tags |
| Docker | Backend and frontend Dockerfiles |
| Kubernetes | Deployments and Services |
| Health checks | FastAPI /health + probes |
| Monitoring | Kubernetes pod/service status + health endpoint |
| Security validation | JWT protection + pip check |
