pipeline {
    agent any

    environment {
        VERSION = '1.0.0'
        BACKEND_IMAGE = "employee-backend:${VERSION}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                bat 'python -m pip install -r backend/requirements.txt'
                bat 'cd backend && python -m pytest -v'
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

                bat 'kubectl rollout status deployment/employee-backend -n employee-system --timeout=120s'
            }
        }

        stage('Health Check') {
            steps {
                bat 'kubectl get pods -n employee-system'
                bat 'kubectl get services -n employee-system'

                bat '''kubectl exec deployment/employee-backend -n employee-system -- python -c "import urllib.request; print(urllib.request.urlopen('http://127.0.0.1:8000/health').read().decode())"'''
            }
        }

        stage('Start Swagger Access') {
            steps {
                bat '''
                    echo Starting FastAPI port forwarding...

                    set JENKINS_NODE_COOKIE=dontKillMe

                    start "" /B cmd /c "set JENKINS_NODE_COOKIE=dontKillMe&& kubectl port-forward service/employee-backend 8001:8000 -n employee-system > swagger-port-forward.log 2>&1"

                    powershell -NoProfile -Command "Start-Sleep -Seconds 5"

                    echo.
                    echo ==========================================
                    echo FASTAPI SWAGGER
                    echo ==========================================
                    echo Swagger UI:
                    echo http://localhost:8001/docs
                    echo.
                    echo Swagger Alias:
                    echo http://localhost:8001/doc
                    echo.
                    echo Health:
                    echo http://localhost:8001/health
                    echo ==========================================
                    echo.

                    echo Port forwarding process started.
                    exit /b 0
                '''
            }
        }
    }

    post {
        always {
            echo 'Employee Management CI/CD pipeline completed.'
        }

        success {
            echo '=========================================='
            echo 'BUILD SUCCESS'
            echo '=========================================='
            echo 'Swagger UI: http://localhost:8001/docs'
            echo 'Swagger Alias: http://localhost:8001/doc'
            echo 'Health: http://localhost:8001/health'
            echo '=========================================='
        }

        failure {
            echo 'BUILD FAILED - Check the failed stage above.'
        }
    }
}
