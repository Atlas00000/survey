# Emergency Rental Assistance Application

A web application for applying to the Emergency Rental Assistance Program.

## Docker Setup

This application can be run using Docker, which ensures consistent environments across different machines.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker

1. **Build and start the application:**

```bash
docker-compose up -d
```

This will build the Docker image and start the container in detached mode.

2. **Access the application:**

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

3. **Stop the application:**

```bash
docker-compose down
```

### Development with Docker

For development purposes, you can use the following commands:

1. **Build the Docker image:**

```bash
docker build -t rental-assistance-app .
```

2. **Run the container:**

```bash
docker run -p 3000:3000 rental-assistance-app
```

## Future Enhancements

- Backend integration with database
- User authentication
- Admin dashboard
- Application status tracking

## License

This project is licensed under the MIT License - see the LICENSE file for details.
