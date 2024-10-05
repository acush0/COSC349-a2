#!/bin/bash

# Ensure all three parameters are passed
if [ $# -ne 3 ]; then
  echo "Usage: $0 <userId> <repo_name> <region>"
  exit 1
fi

# Parameters
USER_ID=$1
REPO_NAME=$2
REGION=$3

# Frontend operations
echo "Building and pushing frontend image..."
cd frontend || { echo "Frontend folder not found"; exit 1; }
docker build -t frontend . --no-cache
docker tag frontend:latest "$USER_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:frontend"
docker push "$USER_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:frontend"
cd .. || exit

echo "Frontend image pushed successfully!"
