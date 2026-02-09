#!/bin/bash

IMAGE_NAME="dacon-frontend"
CONTAINER_NAME="dacon-frontend"
PORT=3000

# 기존 컨테이너 정리
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "기존 컨테이너를 제거합니다..."
    docker stop "$CONTAINER_NAME" 2>/dev/null
    docker rm "$CONTAINER_NAME" 2>/dev/null
fi

# 이미지 빌드
echo "Docker 이미지를 빌드합니다..."
docker build -t "$IMAGE_NAME" .

if [ $? -ne 0 ]; then
    echo "빌드에 실패했습니다."
    exit 1
fi

# 컨테이너 실행
echo "컨테이너를 실행합니다... (http://localhost:${PORT})"
docker run -d \
    --name "$CONTAINER_NAME" \
    -p "${PORT}:80" \
    "$IMAGE_NAME"
