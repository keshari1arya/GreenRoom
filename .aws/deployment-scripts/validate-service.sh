#!/bin/bash

# Validate the application deployment

# Check if the application is running
APP_NAME="GreenRoom"
APP_PORT=5000

if lsof -i:$APP_PORT | grep -q $APP_NAME; then
    echo "Application $APP_NAME is running on port $APP_PORT."
else
    echo "Application $APP_NAME is not running on port $APP_PORT."
    exit 1
fi

# Perform a health check
HEALTH_CHECK_URL="http://localhost:$APP_PORT/health"

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_CHECK_URL)

if [ $HTTP_STATUS -eq 200 ]; then
    echo "Health check passed."
else
    echo "Health check failed with status code $HTTP_STATUS."
    exit 1
fi

echo "Application validation completed successfully."