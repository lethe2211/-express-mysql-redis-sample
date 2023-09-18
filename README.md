# Sample app for self learning of ISUCON

## Dependencies

* Docker
* Docker Compose

## How to use

```bash
docker compose up --build

curl -XPOST http://localhost:8080/initialize
  # Initialize DB

curl http://localhost:8080/users/1
```