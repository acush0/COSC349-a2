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
   git clone https://github.com/haydenaish/COSC349-a1.git
   cd COSC349-a1
   ```

2. Start the application:
   ```
   docker compose up --build
   ```

3. Access the application at `http://localhost:3000`

## Project Structure

```
COSC349-A1/
├── frontend/           # React frontend
├── backend/            # Java backend
├── db-init/            # MySQL database seeders and tables
├── my.cnf              # database configuration  
├── docker-compose.yml  # Docker Compose configuration
└── README.md           # This file
```

## Development

### Making Changes to the Frontend

1. Navigate to the `frontend` directory
2. Make your changes
3. Rebuild and restart the frontend container:
   ```
   docker compose down frontend
   docker compose build frontend
   docker compose up frontend
   ```

### Making Changes to the Backend

1. Navigate to the `backend` directory
2. Make your changes
3. Rebuild and restart the backend container:
   ```
   docker compose down backend
   docker compose build backend
   docker compose up backend
   ```

### Deployment
Follow the steps in `setupSteps.md` to deploy the website

## API Documentation

The backend api is specified in the backend/src/resources in a OpenAPI yaml file. 

## Contributing

We welcome contributions to improve the Student Flat Organization Web App. Here's how you can contribute:

1. Fork the project repository
2. Create a new branch for your feature or bug fix (e.g., `git checkout -b add-payment-reminders`)
3. Make your changes and commit them with a clear, descriptive message
4. Push your changes to your fork
5. Submit a pull request to the main repository, describing the changes you've made
