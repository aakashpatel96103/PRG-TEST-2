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
                powershell '''
                    $port = 8001

                    $existing = Get-NetTCPConnection `
                        -LocalPort $port `
                        -State Listen `
                        -ErrorAction SilentlyContinue

                    if ($existing) {
                        Write-Host "Port 8001 is already running."
                    }
                    else {
                        Write-Host "Starting FastAPI port-forward..."

                        Start-Process `
                            -FilePath "kubectl.exe" `
                            -ArgumentList "port-forward","service/employee-backend","8001:8000","-n","employee-system" `
                            -WindowStyle Hidden

                        Start-Sleep -Seconds 5
                    }

                    Write-Host ""
                    Write-Host "=========================================="
                    Write-Host " FastAPI Swagger UI"
                    Write-Host " http://localhost:8001/docs"
                    Write-Host ""
                    Write-Host " Short Swagger URL"
                    Write-Host " http://localhost:8001/doc"
                    Write-Host ""
                    Write-Host " Health Check"
                    Write-Host " http://localhost:8001/health"
                    Write-Host "=========================================="
                '''
            }
        }
    }

    post {
        always {
            echo 'Employee Management CI/CD pipeline completed.'
        }

        success {
            echo 'BUILD SUCCESS'
            echo 'Swagger: http://localhost:8001/docs'
            echo 'Swagger Alias: http://localhost:8001/doc'
            echo 'Health: http://localhost:8001/health'
        }

        failure {
            echo 'BUILD FAILED - Check the stage above for the error.'
        }
    }
}
