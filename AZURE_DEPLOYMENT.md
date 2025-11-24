# Expense Splitter - Azure Deployment Guide

This guide explains how to deploy the Expense Splitter application to Microsoft Azure.

## Deployment URL
🌐 **https://splitwisemini.azurewebsites.net/**

## Azure Deployment Options

### Option 1: Azure App Service (Recommended for simplicity)

#### Prerequisites
- Azure CLI installed
- Azure subscription
- Docker installed (for container deployment)

#### Steps

1. **Login to Azure**
```bash
az login
```

2. **Create Resource Group**
```bash
az group create --name expense-splitter-rg --location eastus
```

3. **Create App Service Plan**
```bash
az appservice plan create \
  --name expense-splitter-plan \
  --resource-group expense-splitter-rg \
  --sku B1 \
  --is-linux
```

4. **Deploy via Web App (Static Site)**
```bash
# Build the application
npm run build --configuration production

# Create a web app
az webapp create \
  --resource-group expense-splitter-rg \
  --plan expense-splitter-plan \
  --name splitwisemini \
  --runtime "NODE|20-lts"

# Deploy using ZIP
cd dist/expense-splitter/browser
zip -r app.zip .
az webapp deployment source config-zip \
  --resource-group expense-splitter-rg \
  --name splitwisemini \
  --src app.zip
```

5. **Or Deploy via Docker Container**
```bash
# Build Docker image
docker build -t expense-splitter:latest .

# Login to Azure Container Registry (or Docker Hub)
az acr login --name yourregistry

# Tag and push image
docker tag expense-splitter:latest yourregistry.azurecr.io/expense-splitter:latest
docker push yourregistry.azurecr.io/expense-splitter:latest

# Create web app with container
az webapp create \
  --resource-group expense-splitter-rg \
  --plan expense-splitter-plan \
  --name splitwisemini \
  --deployment-container-image-name yourregistry.azurecr.io/expense-splitter:latest
```

### Option 2: Azure Kubernetes Service (AKS)

#### Prerequisites
- Azure CLI with AKS extension
- kubectl installed
- Docker installed

#### Steps

1. **Create AKS Cluster**
```bash
# Create resource group
az group create --name expense-splitter-aks-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group expense-splitter-aks-rg \
  --name expense-splitter-aks \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials \
  --resource-group expense-splitter-aks-rg \
  --name expense-splitter-aks
```

2. **Create Azure Container Registry**
```bash
az acr create \
  --resource-group expense-splitter-aks-rg \
  --name expensesplitteracr \
  --sku Basic

# Attach ACR to AKS
az aks update \
  --resource-group expense-splitter-aks-rg \
  --name expense-splitter-aks \
  --attach-acr expensesplitteracr
```

3. **Build and Push Image**
```bash
# Build image
docker build -t expense-splitter:latest .

# Tag for ACR
docker tag expense-splitter:latest expensesplitteracr.azurecr.io/expense-splitter:latest

# Login to ACR
az acr login --name expensesplitteracr

# Push image
docker push expensesplitteracr.azurecr.io/expense-splitter:latest
```

4. **Update Kubernetes manifests**

Update `k8s/deployment.yaml`:
```yaml
spec:
  containers:
  - name: expense-splitter
    image: expensesplitteracr.azurecr.io/expense-splitter:latest
```

5. **Deploy to AKS**
```bash
kubectl apply -f k8s/
```

6. **Configure DNS**
```bash
# Get external IP
kubectl get svc expense-splitter

# Create DNS zone (if needed)
az network dns zone create \
  --resource-group expense-splitter-aks-rg \
  --name azurewebsites.net

# Add A record pointing to the LoadBalancer IP
```

### Option 3: Azure Static Web Apps

#### Steps

1. **Install SWA CLI**
```bash
npm install -g @azure/static-web-apps-cli
```

2. **Build the app**
```bash
npm run build --configuration production
```

3. **Deploy**
```bash
# Login
az login

# Create static web app
az staticwebapp create \
  --name splitwisemini \
  --resource-group expense-splitter-rg \
  --source https://github.com/pimasuta/AITest \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "dist/expense-splitter/browser"

# Or deploy directly
swa deploy dist/expense-splitter/browser \
  --deployment-token <your-deployment-token>
```

## Environment Configuration

### App Service Configuration

Set environment variables in Azure Portal or via CLI:

```bash
az webapp config appsettings set \
  --resource-group expense-splitter-rg \
  --name splitwisemini \
  --settings \
    AZURE_CLIENT_ID="9f31697a-b36a-4e2c-85b5-607d9c4283f4" \
    AZURE_TENANT_ID="b210c743-80a7-4519-985b-d870f711a83e"
```

### Custom Domain (Optional)

1. **Add custom domain**
```bash
az webapp config hostname add \
  --resource-group expense-splitter-rg \
  --webapp-name splitwisemini \
  --hostname splitwisemini.azurewebsites.net
```

2. **Enable HTTPS**
```bash
az webapp update \
  --resource-group expense-splitter-rg \
  --name splitwisemini \
  --https-only true
```

## CI/CD with GitHub Actions

Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build --configuration production
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'splitwisemini'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: dist/expense-splitter/browser
```

Get publish profile:
```bash
az webapp deployment list-publishing-profiles \
  --resource-group expense-splitter-rg \
  --name splitwisemini \
  --xml
```

Add to GitHub Secrets as `AZURE_WEBAPP_PUBLISH_PROFILE`

## Monitoring & Diagnostics

### Enable Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app splitwisemini-insights \
  --location eastus \
  --resource-group expense-splitter-rg

# Link to Web App
az webapp config appsettings set \
  --resource-group expense-splitter-rg \
  --name splitwisemini \
  --settings \
    APPINSIGHTS_INSTRUMENTATIONKEY="<instrumentation-key>"
```

### View Logs

```bash
# Stream logs
az webapp log tail \
  --resource-group expense-splitter-rg \
  --name splitwisemini

# Download logs
az webapp log download \
  --resource-group expense-splitter-rg \
  --name splitwisemini \
  --log-file logs.zip
```

## Scaling

### Vertical Scaling (Change tier)
```bash
az appservice plan update \
  --resource-group expense-splitter-rg \
  --name expense-splitter-plan \
  --sku P1V2
```

### Horizontal Scaling (Auto-scale)
```bash
az monitor autoscale create \
  --resource-group expense-splitter-rg \
  --resource splitwisemini \
  --resource-type Microsoft.Web/sites \
  --name autoscale-splitwisemini \
  --min-count 1 \
  --max-count 5 \
  --count 1

az monitor autoscale rule create \
  --resource-group expense-splitter-rg \
  --autoscale-name autoscale-splitwisemini \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 1
```

## Security

### Enable Managed Identity

```bash
az webapp identity assign \
  --resource-group expense-splitter-rg \
  --name splitwisemini
```

### Add Custom Headers

Create `web.config` in the root:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <add name="X-Frame-Options" value="SAMEORIGIN" />
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-XSS-Protection" value="1; mode=block" />
        <add name="Strict-Transport-Security" value="max-age=31536000; includeSubDomains" />
      </customHeaders>
    </httpProtocol>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## Cost Estimation

### App Service (B1 tier)
- **~$13/month** - Basic tier with 1 core, 1.75 GB RAM
- Good for development/testing

### App Service (P1V2 tier)
- **~$96/month** - Production tier with 1 core, 3.5 GB RAM
- Auto-scaling support

### AKS (3 nodes)
- **~$220/month** - 3 Standard_D2s_v3 nodes
- High availability, better for large scale

## Troubleshooting

### Check deployment status
```bash
az webapp deployment list \
  --resource-group expense-splitter-rg \
  --name splitwisemini
```

### SSH into container
```bash
az webapp ssh \
  --resource-group expense-splitter-rg \
  --name splitwisemini
```

### Reset app
```bash
az webapp restart \
  --resource-group expense-splitter-rg \
  --name splitwisemini
```

## Cleanup

```bash
# Delete resource group (removes all resources)
az group delete \
  --name expense-splitter-rg \
  --yes --no-wait
```

## Production Checklist

- ✅ Enable HTTPS only
- ✅ Configure custom domain (optional)
- ✅ Enable Application Insights
- ✅ Configure auto-scaling
- ✅ Set up CI/CD pipeline
- ✅ Enable managed identity
- ✅ Configure backup policy
- ✅ Set up monitoring alerts
- ✅ Review security settings

## Support

- Azure Portal: https://portal.azure.com
- Azure Documentation: https://docs.microsoft.com/azure
- Azure Status: https://status.azure.com
