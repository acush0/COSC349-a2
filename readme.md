# Student Flat Organization Web App

## Project Overview

This web application helps student flats stay organized, manage tasks, and handle shared payments. It consists of three main components:

1. Frontend: A React-based user interface
2. Backend: A Java-based API server
3. Database: A MySQL database for data storage

## Features

- User account creation and authentication
- Flat creation and joining
- Task creation and assignment
- Payment tracking and management
- Calendar view for tasks and payments
- User profiles

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone the repository:
   ```
   git clone https://github.com/acush0/COSC349-a2.git
   ```

2. Follow steps in setupSteps.md


## Project Structure

```
COSC349-A1/
├── frontend/           # React frontend
├── backend/            # Java backend
├── db-init/            # MySQL database seeders and tables
├── buildBackend.sh     # Bash script for publishing backend container to AWS ECR  
├── buildFrontend.sh    # Bash script for publishing frontend container to AWS ECR 
└── README.md           # This file
```

## Development

### Making Changes to the Frontend

1. Make your changes
2. Rebuild and publish the frontend container:
   ```
   ./buildFrontend.sh <aws_userId> <ecr_repo_name> <region>  
   ```
3. Restart frontend task on AWS

### Making Changes to the Backend

1. Make your changes
2. Rebuild and publish the backend container:
   ```
   ./buildBackend.sh <aws_userId> <ecr_repo_name> <region>  
   ```
3. Restart backend task on AWS
4. Change IP in fronted/src/keys.js to match new public backend IP
5. Follow steps under "making changes to frontend"


## API Documentation

The backend api is specified in the backend/src/resources in a OpenAPI yaml file. 

## Contributing

We welcome contributions to improve the Student Flat Organization Web App. Here's how you can contribute:

1. Fork the project repository
2. Create a new branch for your feature or bug fix (e.g., `git checkout -b add-payment-reminders`)
3. Make your changes and commit them with a clear, descriptive message
4. Push your changes to your fork
5. Submit a pull request to the main repository, describing the changes you've made
