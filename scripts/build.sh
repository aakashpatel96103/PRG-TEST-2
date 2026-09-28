#!/bin/sh
docker build -t employee-backend:1.0.0 ./backend
docker build -t employee-frontend:1.0.0 ./frontend
