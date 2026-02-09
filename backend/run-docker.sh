#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="smishing-guard-backend"
CONTAINER_NAME="smishing-guard-backend"
PORT="${PORT:-8000}"

cd "$(dirname "$0")"

# 기존 컨테이너가 있으면 제거
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo ":: Stopping existing container..."
  docker rm -f "$CONTAINER_NAME"
fi

# 이미지 빌드
echo ":: Building image..."
docker build -t "$IMAGE_NAME" .

# 컨테이너 실행
echo ":: Starting container on port ${PORT}..."
docker run -d \
  --name "$CONTAINER_NAME" \
  -p "${PORT}:8000" \
  -v "$(pwd)/data:/app/data" \
  "$IMAGE_NAME"

echo ":: Backend is running at http://localhost:${PORT}"
