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

# Backend operations
echo "Building and pushing backend image..."
cd backend || { echo "Backend folder not found"; exit 1; }
docker build -t backend . --no-cache
docker tag backend:latest "$USER_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:backend"
docker push "$USER_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:backend"
cd .. || exit

echo "Backend image pushed successfully!"
