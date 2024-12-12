# Contributin

Contributing explain how to configure and run the project

## Instalation 

Before start the project you need to install the following dependencies

* [NodeJS y NPM](https://nodejs.org/)
* [mysql](https://www.mysql.com)
  
## Run dependencies

### Environment variables

Before start the project you need to configure the following environment variables

```.env
********* Frontend/.env *********
VITE_API_URI=http://localhost:9000/api/v1
VITE_API_UPLOAD=http://localhost:9000
```

* `VITE_API_URI` This is the url to the API
* `VITE_API_UPLOAD` This is the url to the API upload

```.env
********* Backend/.env *********
#can be 'development' or 'production'
MYSQL_URI=mysql://root:P@tata@localhost:3306/ai_blog_posts
MYSQL_ROOT_PASSWORD=P@tata
MYSQL_DATABASE= ai_blog_posts
CA_PATH=./ca.pem
JWT_SECRET=secret
NODE_ENV=production
EMAIL=deveopsengineer473@gmail.com
PASSWORD=iygj qars kvha yqzx
VITE_URI_HOST=http://localhost:5173
VITE_PROD_URI=http://localhost
VITE_PROD_URI_HTTP=http://localhost:80
VITE_PROD_URI_HTTPS=https://localhost:443
VITE_API_URI=http://localhost:9000/api/v1
VITE_APP_SWAGGER=http://localhost:9000

QDRANT_URL=https://qdrantKEY.cloud.qdrant.io
QDRANT_API_KEY=dUw-ugJVFnQJL-Fak1I7_Z9umNKAZhjcja_JHxbQ

GOOGLE_API_KEY=AIzaVSJRI5ARTCqloQ
GOOGLE_SEARCH_ENGINE_ID=b1faea9a4725

AWS_ACCESS_KEY_ID=PKKIA552525252322JWDZD5OO
AWS_SECRET_ACCESS_KEY=ZfxdnaIVpAYQqho854454
AWS_REGION=us-east-2
AWS_BUCKET_NAME=uploadsblog
```

* `NODE_ENV` Configure the environment (development or production)
* `MYSQL_URI` Configure the connection to the database
* `MYSQL_ROOT_PASSWORD` Configure the password for the root user
* `MYSQL_DATABASE` Configure the name of the database
* `CA_PATH` Configure the path to the certificate file
* `JWT_SECRET` Configure the secret for the JWT
* `EMAIL` Configure the email for the user
* `PASSWORD` Configure the password for the user
* `VITE_URI_HOST` Configure the url to the frontend
* `VITE_PROD_URI` Configure the url to the backend
* `VITE_PROD_URI_HTTP` Configure the url to the backend http
* `VITE_PROD_URI_HTTPS` Configure the url to the backend https
* `VITE_API_URI` Configure the url to the api
* `VITE_APP_SWAGGER` Configure the url to the swagger
* `QDRANT_URL` Configure the url to the qdrant
* `QDRANT_API_KEY` Configure the api key to the qdrant
* `GOOGLE_API_KEY` Configure the api key to the google
* `GOOGLE_SEARCH_ENGINE_ID` Configure the search engine id to the google
* `AWS_ACCESS_KEY_ID` Configure the access key id to the aws
* `AWS_SECRET_ACCESS_KEY` Configure the secret access key to the aws
* `AWS_REGION` Configure the region to the aws
* `AWS_BUCKET_NAME` Configure the bucket name to the aws


### Install dependencies

To install the dependencies, you can use the following commands:

```bash
cd Backend
npm install
cd ../Frontend
npm install
```

or just run `make install-dependencies`

###  Makefile Run

For execution, we use a Makefile with instructions for both infrastructures. Here you can learn about using  [Phony Targets](https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html). With the Makefile you can:

1. Install dependencies: `make install-dependencies`

2. To run the app:
   1. **linux** o **macOS**: ejecuta `make dev-start`
   2. **Windows**: Run `make dev-backend` and in another terminal `make dev-frontend`


### Scripts BBDD

To create the database, you can use the following commands:

```bash
make create-database
```

### Certificates

To create the certificates, you can use the following commands:

```bash
make generate-certificates
```

