pipeline {
    agent any

    environment {
        VERSION = '1.0.0'
        BACKEND_IMAGE = "employee-backend:${VERSION}"
        FRONTEND_IMAGE = "employee-frontend:${VERSION}"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Backend Tests') {
            steps {
                bat 'python -m pip install -r backend/requirements.txt'
                bat 'cd backend && python -m pytest -v'
            }
        }

        stage('Frontend Build Test') {
            steps {
                bat 'cd frontend && npm install'
                bat 'cd frontend && npm run build'
            }
        }

        stage('Security Validation') {
            steps {
                bat 'python -m pip check'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %BACKEND_IMAGE% backend'
                bat 'docker build -t %FRONTEND_IMAGE% frontend'
            }
        }

        stage('Artifact Version') {
            steps {
                bat 'echo Build version: %VERSION%'
                bat 'type VERSION'
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                bat 'kubectl apply -f kubernetes/namespace.yaml'
                bat 'kubectl apply -f kubernetes/configmap.yaml'
                bat 'kubectl apply -f kubernetes/backend-deployment.yaml'
                bat 'kubectl apply -f kubernetes/backend-service.yaml'
                bat 'kubectl apply -f kubernetes/frontend-deployment.yaml'
                bat 'kubectl apply -f kubernetes/frontend-service.yaml'
            }
        }

        stage('Health Check') {
            steps {
                bat 'kubectl get pods -n employee-system'
                bat 'kubectl get services -n employee-system'
            }
        }
    }

    post {
        always {
            echo 'CI/CD pipeline completed.'
        }
    }
}
