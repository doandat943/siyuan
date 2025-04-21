FROM golang:1.21-alpine AS build-backend

WORKDIR /go/src/github.com/siyuan-note/siyuan/
COPY . .

RUN apk add --no-cache gcc musl-dev git && \
    cd kernel && \
    go build --tags fts5 -v -ldflags "-s -w -X github.com/siyuan-note/siyuan/kernel/util.Mode=prod" && \
    cd .. && \
    mkdir -p /opt/siyuan/kernel && \
    mv kernel/kernel /opt/siyuan/kernel && \
    cp -r kernel/appearance/ /opt/siyuan/ && \
    cp -r kernel/guide/ /opt/siyuan/

FROM node:18-alpine AS build-frontend

WORKDIR /go/src/github.com/siyuan-note/siyuan/
COPY . .

RUN cd app && \
    npm install && \
    npm run build && \
    cd .. && \
    mkdir -p /opt/siyuan/stage && \
    cp -r app/build/* /opt/siyuan/stage/

FROM alpine:latest

COPY --from=build-backend /opt/siyuan /opt/siyuan
COPY --from=build-frontend /opt/siyuan/stage /opt/siyuan/stage
COPY kernel/entrypoint.sh /opt/siyuan/

RUN apk add --no-cache ca-certificates tzdata && \
    chmod +x /opt/siyuan/entrypoint.sh && \
    addgroup -S siyuan && \
    adduser -S -G siyuan siyuan && \
    chown -R siyuan:siyuan /opt/siyuan

USER siyuan
WORKDIR /opt/siyuan

ENV PUID=1000 \
    PGID=1000 \
    TZ=Asia/Shanghai \
    SIYUAN_WORKSPACE_PATH=/siyuan/workspace \
    SIYUAN_ACCESS_AUTH_CODE='' \
    SIYUAN_SERVER_MODE=true \
    SIYUAN_SERVER_HOST=0.0.0.0 \
    SIYUAN_SERVER_PORT=6806 \
    SIYUAN_JWT_SECRET='' \
    SIYUAN_CORS_ORIGINS='*'

EXPOSE 6806

VOLUME /siyuan/workspace

ENTRYPOINT ["/opt/siyuan/entrypoint.sh"]
