# AWS Environment Setup and Lambda Function Creation

## 1. Create Security Groups
- **In the Security Group menu:**
  - **Create a Security Group for SQL:**
    - Name: `allow_sql`
    - **Inbound Rule:**
      - Type: MySQL/Aurora
      - Source: `0.0.0.0/0` (To allow public access)
  - **Create a Security Group for the Backend:**
    - **Inbound Rule:**
      - Type: Custom TCP
      - Port Range: `8080`
      - Source: `0.0.0.0/0` (To allow public access)
    - **Outbound Rule:**
      - Destination: Anywhere
  - **Create a Final Security Group(frontend):**
    - **Inbound Rule:**
      - Type: Custom TCP
      - Port Range: `3000`
      - Source: `0.0.0.0/0` (To allow public access)
    - **Outbound Rule:**
      - Destination: Anywhere

## 2. Create RDS Instance
- **In the AWS Console:**
  - Navigate to **RDS** and create a new instance.
  - **Set to Free Tier.**
  - Under **Connectivity**, set **Public Access** to `Yes`.
  - Take note of the generated password.
  - **Add the Security Group(allow_sql) created in Step 1.**
  - After creation, take note of the RDS endpoint.

## 3. Pull the Repository
- Clone the repository into a folder:
  ```bash
  git clone https://github.com/acush0/COSC349-a2.git
## 4. Update Backend Configuration
- In the backend:
- Open src/main/java/dao/JdbiDaoFactory.java.
- Change the username and password (lines 9 and 10) to admin and the password you previously created.
- Change the publicIp (line 11) to the RDS endpoint.
## 5. Install MySQL
- Install MySQL version 8.4 if not already installed.
- From a terminal, connect to the RDS:
```bash
mysql -h <RDS endpoint> -P 3306 -u admin -p
```
- Once connected, run the SQL initialization script:
```sql
source db-init/init.sql
```
## 6. Configure AWS CLI Credentials
- Ensure you have AWS CLI credentials set up:
```bash
nano ~/.aws/credentials
```
- Copy and paste your credentials into the file.
## 7. Authenticate Docker with ECR
- Run the following command to authenticate:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <userId>.dkr.ecr.us-east-1.amazonaws.com
```
## 8. Create ECR Repository
Create an ECR repository to store Docker images:
```bash
aws ecr create-repository --repository-name <repo_name> --region us-east-1
```
- Take note of the repo_name chosen.
## 9. Create Backend Image
- In the root directory, run:
```bash
./buildBackend.sh <userID> <repo_name> <region>
```
## 10. Create ECS Cluster and Task Definition
- Under ECS in the AWS Console:
- Create a new cluster (leave everything as default).
- <b>Create Backend Task Definition:</b>
    - Use the backend image pushed to ECR.
    - Ensure the OS architecture is suitable for the container (e.g., arm64).
    - Set the task execution role to labRole or suitable.
    - Add the container to the task definition from the URI in ECR and set the port to 8080.
## 11. Run New Backend Task
- From the cluster, navigate to Tasks and run a new task.
- Under deployment configuration, set the family to the task definition created.
- Set the security group for backend traffic.
- Allow Public IP.
## 12. Create Frontend
- Change the endpoint in frontend/src/key.js to the public IP address of the backend.
- In the root directory (in a bash shell), run:
```bash
./buildFrontend.sh <userID> <repo_name> <region>
```
## 13. Create Frontend Task Definition
- Under ECS in the AWS Console:
- Create a task definition using the frontend image pushed to ECR.
- Ensure the OS architecture is suitable for the container (e.g., arm64).
- Set the task execution role to labRole or suitable.
- Add the container to the task definition from the URI in ECR and set the port to 3000.
## 14. Run New Frontend Task
- From the cluster, navigate to Tasks and run a new task.
- Under deployment configuration, set the family to the task definition created.
- Set the security group for frontend traffic.
- Allow Public IP.
## 15. Access the Application
- Once the instance has been created, the website can be visited from the generated public IP on port 3000.
##  Create Lambda Database Cleaner
- In the AWS Lambda Console:
    - Click Create Function.
    - Select Author from scratch.
    - Choose Python 3.12 as the runtime.
    - Use the appropriate role (e.g., LabRole).
    - Create the function.
- #### Lambda Function Configuration
    - In lambda-package/lambda_function.py, make the following changes:
        - Set db_host to the RDS hostname from Step 2.
        - Set db_user to "admin".
        - Set db_password to the password created when setting up RDS.
        - Set db_name to "example".
    - In the lambda-package folder, run:
```bash
zip -r lambda_function.zip .
```
### Upload the Lambda Function
Back in the AWS Lambda console:
- Select Upload from -> .zip file and select the zip file created.
- Select Deploy.
### Add Trigger for Lambda Function
- Select Add Trigger.
- Choose EventBridge and create a new rule called daily-timer.
- Under Schedule expression, write:
```rate(1 day)```, then add the trigger.
