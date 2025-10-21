# webapp


# **Health Check API**
A simple Node.js REST API that provides a health check endpoint (`/healthz`) to verify database connectivity. The API uses Express.js and Sequelize ORM to interact with a PostgreSQL database.

## **Features**

- **Health Check Endpoint (`/healthz`)**
  - **Database Connectivity:** Inserts a record into the database to verify the connection.
  - Returns:
    - `200 OK`: Successful database connection.
    - `503 Service Unavailable`: Database connection failure.
    - `400 Bad Request`: Request includes a payload.
    - `405 Method Not Allowed`: Unsupported HTTP method (e.g., `POST`, `HEAD`).
  - Adds appropriate headers to prevent response caching.

---

## **Tech Stack**

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **Sequelize**: ORM for PostgreSQL.
- **PostgreSQL**: Relational database for storing health check data.
- **Docker**: Containerized PostgreSQL setup.

---

## **Project Structure**

```
.github/
└── workflows/        # GitHub Actions workflow files
artifact/             # Build artifacts (e.g., zipped code)
node_modules/         # Node.js dependencies (ignored by Git)
packer/
├── placeholder.json  # Placeholder or sample JSON file
└── ubuntu-node.pkr.hcl  # Packer template for building a custom AMI
src/
├── models/               # Database models (Sequelize)
│   └── HealthCheck.js    # Health check table model
├── routes/               # API route definitions
│   └── healthCheckRoutes.js
├── controllers/          # Route handlers and business logic
│   └── healthCheckController.js
├── middlewares/          # Custom middlewares
│   └── validatePayload.js
├── config/               # Configuration files
│   └── db.js             # Database configuration
├── server.js             # Entry point of the application
├── package.json          # Dependencies and scripts
└── README.md             # Documentation                  # Application source code
tests/
├── dbTest.js         # Simple DB connection test
└── healthCheck.test.js  # Tests for the /healthz endpoint
.env                  # Environment variables file (ignored by Git)
.gitignore
LICENSE
package-lock.json
package.json
README.md             # Project documentation
start.sh             # Script used by Packer or local setup

```

---

## **Setup Instructions**

### **1. Prerequisites**

- Install **Node.js** (>= 16.x).
- Install **Docker** for PostgreSQL setup.
- Install **npm** for package management.

---

### **2. Clone the Repository**

```bash
git clone https://github.com/csye6225-sjp/webapp.git
cd webapp
```

---

### **3. Start PostgreSQL with Docker**

Run the following command to start a PostgreSQL container:

```bash
docker run --name webapp-db -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5433:5432 -d postgres
```

---

### **4. Install Dependencies**

Install the required Node.js dependencies:

```bash
npm install
```

---

### **5. Run the Application**

Start the server:

```bash
node src/server.js
```

By default, the server runs on `http://localhost:8080`.

You can also run the server with env vars in one line (useful for local Docker Postgres):

```bash
NODE_ENV=development DB_HOST=localhost DB_PORT=5433 DB_USER=myuser DB_PASSWORD=mypassword DB_NAME=mydatabase DB_SSL=false node src/server.js
```
---

## **API Documentation**

### **Health Check Endpoint**

#### **GET `/healthz`**

- **Purpose**: Checks the service's health by testing the database connection.
- **Behavior**:

  - Inserts a record into the `health_check` table.
  - Returns:
    - `200 OK` if successful.
    - `503 Service Unavailable` if the database is unavailable.
  - Ensures no response caching with `Cache-Control` and `Pragma` headers.

- **Response Codes**:
  - `200 OK`: Successful health check.
  - `503 Service Unavailable`: Database connection issue.
  - `400 Bad Request`: Request includes a payload.
  - `405 Method Not Allowed`: Unsupported HTTP method.

#### **Examples**

- **Success (`200 OK`)**

  ```bash
  curl -X GET http://localhost:8080/healthz
  ```

- **Unsupported Method (`405 Method Not Allowed`)**

  ```bash
  curl -X POST http://localhost:8080/healthz
  ```

- **Payload Sent (`400 Bad Request`)**
  ```bash
  curl -X GET http://localhost:8080/healthz -d '{"key": "value"}' -H "Content-Type: application/json"
  ```

---

## **Testing**

### **Run Tests Manually**

You can manually test the `/healthz` endpoint using `curl` or a tool like Postman.

### **Test Cases**

1. **GET `/healthz`**
   - Expected: `200 OK` if the database is connected.
2. **GET `/healthz` with Payload**
   - Expected: `400 Bad Request`.
3. **POST `/healthz`**
   - Expected: `405 Method Not Allowed`.
4. **Database Down**
   - Stop the Docker container and call `/healthz`.
   - Expected: `503 Service Unavailable`.

---

## Certification

### **Certificate Import**

```bash
aws acm import-certificate \
  --certificate fileb://demo_sahanajprakash_me.crt \
  --private-key fileb://private.key \
  --certificate-chain fileb://demo_sahanajprakash_me.ca-bundle \
  --region us-east-1 \
  --profile demo
```
## Docker cleanup (local development)

If you need to remove the local Postgres container or reclaim Docker space, here are safe commands and options.

Safe: stop and remove a specific container

```bash
docker stop webapp-db-1 && docker rm webapp-db-1
```

Safe: remove dangling images and volumes

```bash
docker image prune
docker volume prune
```

Destructive: remove all unused resources (includes volumes)

```bash
docker system prune --volumes
```

MacOS notes

- If you use Docker Desktop, open the app and use Troubleshoot → Clean/Purge to reclaim disk.
- 
## Packer & Terraform

This project is packaged into an AMI using **Packer**; the Packer template is at `packer/ubuntu-node.pkr.hcl`. Typical steps:

1. Create the application artifact:

```bash
  npm run zip
```

2. Build AMI with Packer (local example):

```bash
  packer build packer/ubuntu-node.pkr.hcl
```

The infrastructure for deploying the AMI is in the companion `tf-aws-infra` repo in this workspace — it uses Terraform to create VPC, ALB, ASG, RDS, S3, Secrets Manager and KMS keys. For Terraform docs and downloads see: https://www.terraform.io/

## **Known Issues**

- None at the moment. Feel free to raise issues or PRs if you find bugs.
-

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for more details.
