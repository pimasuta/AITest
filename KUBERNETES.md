# Expense Splitter - Kubernetes Deployment Guide

This guide explains how to deploy the Expense Splitter application to Kubernetes.

## Prerequisites

- Docker installed
- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured to access your cluster
- (Optional) Helm for package management

## Files Created

```
├── Dockerfile                    # Multi-stage Docker build
├── nginx.conf                    # Nginx configuration for SPA
├── .dockerignore                 # Docker build optimization
└── k8s/
    ├── deployment.yaml           # Kubernetes deployment (3 replicas)
    ├── service.yaml              # LoadBalancer service
    ├── ingress.yaml              # Ingress for external access
    ├── configmap.yaml            # Configuration
    └── hpa.yaml                  # Horizontal Pod Autoscaler
```

## Quick Start

### 1. Build Docker Image

```bash
# Build the Docker image
docker build -t expense-splitter:latest .

# Test locally
docker run -p 8080:80 expense-splitter:latest
# Visit http://localhost:8080
```

### 2. Push to Registry (Optional)

If deploying to a remote cluster:

```bash
# Tag for your registry
docker tag expense-splitter:latest your-registry/expense-splitter:latest

# Push to registry
docker push your-registry/expense-splitter:latest

# Update k8s/deployment.yaml with your image path
```

### 3. Deploy to Kubernetes

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Or apply individually
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/ingress.yaml
```

### 4. Verify Deployment

```bash
# Check pods
kubectl get pods -l app=expense-splitter

# Check service
kubectl get svc expense-splitter

# Check deployment
kubectl get deployment expense-splitter

# View logs
kubectl logs -l app=expense-splitter --tail=100
```

### 5. Access the Application

**For LoadBalancer:**
```bash
kubectl get svc expense-splitter
# Use EXTERNAL-IP to access the app
```

**For NodePort (local testing):**
```bash
kubectl get svc expense-splitter
# Access via http://NODE-IP:NODE-PORT
```

**For Ingress:**
```bash
# Update k8s/ingress.yaml with your domain
# Access via https://expense-splitter.example.com
```

## Configuration

### Scaling

**Manual scaling:**
```bash
kubectl scale deployment expense-splitter --replicas=5
```

**Auto-scaling (HPA):**
The HPA is configured to scale between 2-10 replicas based on CPU/memory usage.

```bash
# Check HPA status
kubectl get hpa expense-splitter-hpa
```

## Production Considerations

### 1. SSL/TLS

Install cert-manager for automatic SSL certificates:
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

The ingress.yaml includes cert-manager annotations for Let's Encrypt.

### 2. Resource Limits

Current limits (per pod):
- CPU: 100m requests, 200m limits
- Memory: 128Mi requests, 256Mi limits

Adjust based on your needs in `k8s/deployment.yaml`.

### 3. Health Checks

The deployment includes:
- **Liveness probe**: Restarts unhealthy containers
- **Readiness probe**: Controls traffic routing

### 4. High Availability

- **3 replicas** by default
- **Anti-affinity rules** (optional - add to deployment)
- **PodDisruptionBudget** (optional - create separately)

### 5. Monitoring

Add monitoring with Prometheus/Grafana:
```bash
# Example ServiceMonitor for Prometheus
kubectl apply -f k8s/monitoring/servicemonitor.yaml
```

## Local Development with Minikube

```bash
# Start minikube
minikube start

# Enable ingress addon
minikube addons enable ingress

# Build image in minikube
eval $(minikube docker-env)
docker build -t expense-splitter:latest .

# Deploy
kubectl apply -f k8s/

# Access via minikube tunnel
minikube service expense-splitter --url

# Or expose via port-forward
kubectl port-forward svc/expense-splitter 8080:80
# Visit http://localhost:8080
```

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Image pull errors
```bash
# For local images with minikube
eval $(minikube docker-env)
docker build -t expense-splitter:latest .

# Update imagePullPolicy in deployment.yaml to IfNotPresent
```

### Service not accessible
```bash
# Check service endpoints
kubectl get endpoints expense-splitter

# Check if pods are ready
kubectl get pods -l app=expense-splitter
```

### Ingress not working
```bash
# Check ingress controller is installed
kubectl get pods -n ingress-nginx

# Check ingress status
kubectl describe ingress expense-splitter
```

## Cleanup

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete individually
kubectl delete deployment expense-splitter
kubectl delete service expense-splitter
kubectl delete ingress expense-splitter
kubectl delete configmap expense-splitter-config
kubectl delete hpa expense-splitter-hpa
```

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Deploy to Kubernetes
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t expense-splitter:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push expense-splitter:${{ github.sha }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/expense-splitter expense-splitter=expense-splitter:${{ github.sha }}
          kubectl rollout status deployment/expense-splitter
```

## Architecture

```
┌─────────────┐
│   Ingress   │ (HTTPS, SSL termination)
└──────┬──────┘
       │
┌──────▼──────┐
│   Service   │ (LoadBalancer)
└──────┬──────┘
       │
┌──────▼──────────────────┐
│  Deployment (3 replicas) │
│  ┌────────────────────┐  │
│  │  Pod 1 (Nginx)     │  │
│  │  expense-splitter  │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Pod 2 (Nginx)     │  │
│  │  expense-splitter  │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Pod 3 (Nginx)     │  │
│  │  expense-splitter  │  │
│  └────────────────────────│  │
└─────────────────────────┘
```

## Support

For issues or questions:
1. Check pod logs: `kubectl logs -l app=expense-splitter`
2. Check events: `kubectl get events --sort-by=.metadata.creationTimestamp`
3. Review Kubernetes documentation: https://kubernetes.io/docs/
