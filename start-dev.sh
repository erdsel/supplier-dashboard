#!/bin/bash

echo "Starting development environment with hot-reload..."
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo "Services are starting..."
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3002"
echo "Swagger Docs: http://localhost:3002/api-docs"
echo ""
echo "Logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "Stop: docker-compose -f docker-compose.dev.yml down"