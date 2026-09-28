# Employee Management System – CI/CD Pipeline

A simple college-friendly Employee Management System using **FastAPI, SQLite, Jenkins, Docker and Kubernetes**.

## Features

- JWT authentication
- Employee CRUD operations
- FastAPI Swagger UI
- Automated tests with Pytest
- Jenkins CI/CD pipeline
- Versioned Docker image
- Kubernetes deployment
- Kubernetes readiness and liveness health checks
- Basic security/dependency validation

## Project Flow

GitHub → Jenkins → Tests → Security Validation → Docker Build → Versioned Artifact → Kubernetes → Health Check → Swagger API

## Backend Run

```bash
cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Open:

- API: http://localhost:8000
- Swagger: http://localhost:8000/docs
- Health: http://localhost:8000/health

## Authentication

Register a user using:

`POST /auth/register`

Then login using:

`POST /auth/login`

Copy the JWT token and use the **Authorize** button in Swagger:

`Bearer YOUR_TOKEN`

## Employee CRUD

Use Swagger to test:

- `GET /employees`
- `GET /employees/{id}`
- `POST /employees`
- `PUT /employees/{id}`
- `DELETE /employees/{id}`

## Automated Tests

```bash
cd backend
python -m pytest -v
```

## Docker

```bash
docker build -t employee-backend:1.0.0 backend
docker run -p 8000:8000 employee-backend:1.0.0
```

## Jenkins Pipeline

The Jenkinsfile performs:

1. Checkout from Git
2. Install backend dependencies
3. Run Pytest
4. Validate dependencies
5. Build Docker image
6. Read artifact version
7. Deploy FastAPI to Kubernetes
8. Wait for rollout
9. Display pods and service status

## Kubernetes

Apply:

```bash
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml
```

Check:

```bash
kubectl get pods -n employee-system
kubectl get services -n employee-system
```

The backend service uses NodePort **30081**.

For environments where the Kubernetes node is reachable locally:

`http://localhost:30081/docs`

If localhost NodePort is not reachable, use:

```bash
kubectl port-forward service/employee-backend 8000:8000 -n employee-system
```

Then open:

`http://localhost:8000/docs`

## Monitoring

Basic monitoring is demonstrated using:

```bash
kubectl get pods -n employee-system
kubectl get services -n employee-system
kubectl describe pod -n employee-system
```

The application health endpoint is:

`GET /health`

Kubernetes also uses readiness and liveness probes against `/health`.

## Requirement Mapping

| Requirement | Implementation |
|---|---|
| Authentication | JWT |
| CRUD | FastAPI Employee API |
| CI/CD | Jenkinsfile |
| Automated testing | Pytest |
| Versioned artifacts | VERSION + Docker tag |
| Docker | Backend Dockerfile |
| Kubernetes | Deployment + NodePort Service |
| Health checks | `/health` + Kubernetes probes |
| Monitoring | Kubernetes status + health endpoint |
| Security validation | JWT protection + dependency check |
