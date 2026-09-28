# Kubernetes deployment
This project uses local Docker images tagged 1.0.0 for easy college/lab use.
For Minikube:
1. `minikube start`
2. `eval $(minikube docker-env)` on Git Bash, or use the equivalent Docker environment command for your shell.
3. Build both images.
4. `kubectl apply -f kubernetes/`
