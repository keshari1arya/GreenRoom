# #!/bin/bash
# ls
# pwd
# # Navigate to the application directory
# cd src/Web
# ls
# # Start the .NET application
# DEPLOYMENT_ID="d-C0MI946T9"
# DEPLOYMENT_GROUP_ID="d1260eab-4105-4b23-bc7c-51504ffb17ed"

# cd /opt/codedeploy-agent/deployment-root/$DEPLOYMENT_GROUP_ID/$DEPLOYMENT_ID/deployment-archive/src/Web/publish
# ./GreenRoom.Web
# dotnet run Web.csproj
# echo "Application started successfully."

echo "Stopping the GreenRoom API service..."
sudo systemctl stop greenroom-api.service

echo "Starting the GreenRoom API service..."
sudo systemctl start greenroom-api.service