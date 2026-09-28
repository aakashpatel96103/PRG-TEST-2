pipeline {
    agent any

    environment {
        VERSION = '1.0.0'
        BACKEND_IMAGE = "employee-backend:${VERSION}"
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

        stage('Security Validation') {
            steps { bat 'python -m pip check' }
        }

        stage('Docker Build') {
            steps { bat 'docker build -t %BACKEND_IMAGE% backend' }
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
                bat 'kubectl rollout status deployment/employee-backend -n employee-system --timeout=120s'
            }
        }

        stage('Health Check') {
            steps {
                bat 'kubectl get pods -n employee-system'
                bat 'kubectl get services -n employee-system'
                bat 'kubectl exec deployment/employee-backend -n employee-system -- python -c "import urllib.request; print(urllib.request.urlopen(''http://127.0.0.1:8000/health'').read().decode())"'
            }
        }

        stage('Start Swagger Access') {
            steps {
                powershell '& "$env:WORKSPACE\\scripts\\start-port-forward.ps1"'
            }
        }
    }

    post {
        always {
            echo 'Backend CI/CD pipeline completed.'
        }
        success {
            echo 'Swagger UI: http://localhost:8001/docs'
            echo 'Swagger alias: http://localhost:8001/doc'
        }
    }
}
