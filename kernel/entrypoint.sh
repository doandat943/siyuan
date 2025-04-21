#!/bin/sh
set -e

# Default values
PUID=${PUID:-1000}
PGID=${PGID:-1000}
USER_NAME=${USER_NAME:-siyuan}
GROUP_NAME=${GROUP_NAME:-siyuan}
WORKSPACE_DIR="/siyuan/workspace"

# Set user and group IDs
if [ ! -z "${PUID}" ] && [ ! -z "${PGID}" ]; then
    if [ -z "$(getent group ${PGID})" ]; then
        addgroup -g ${PGID} siyuan
    fi
    if [ -z "$(getent passwd ${PUID})" ]; then
        adduser -D -H -G siyuan -u ${PUID} siyuan
    fi
    chown -R ${PUID}:${PGID} /opt/siyuan
fi

# Set timezone
if [ ! -z "${TZ}" ]; then
    cp /usr/share/zoneinfo/${TZ} /etc/localtime
    echo "${TZ}" > /etc/timezone
fi

# Create workspace directory if it doesn't exist
if [ ! -d "${SIYUAN_WORKSPACE_PATH}" ]; then
    mkdir -p "${SIYUAN_WORKSPACE_PATH}"
    chown -R siyuan:siyuan "${SIYUAN_WORKSPACE_PATH}"
fi

# Generate random JWT secret if not provided
if [ -z "${SIYUAN_JWT_SECRET}" ]; then
    SIYUAN_JWT_SECRET=$(tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w 32 | head -n 1)
fi

# Parse command line arguments for --workspace option or SIYUAN_WORKSPACE_PATH env variable
# Store other arguments in ARGS for later use
if [[ -n "${SIYUAN_WORKSPACE_PATH}" ]]; then
    WORKSPACE_DIR="${SIYUAN_WORKSPACE_PATH}"
fi
ARGS=""
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --workspace=*) WORKSPACE_DIR="${1#*=}"; shift ;;
        *) ARGS="$ARGS $1"; shift ;;
    esac
done

# Change ownership of relevant directories, including the workspace directory
echo "Adjusting ownership of /opt/siyuan, /home/siyuan/, and ${WORKSPACE_DIR}"
chown -R "${PUID}:${PGID}" /opt/siyuan
chown -R "${PUID}:${PGID}" /home/siyuan/
chown -R "${PUID}:${PGID}" "${WORKSPACE_DIR}"

# Switch to the newly created user and start the main process with all arguments
echo "Starting Siyuan with UID:${PUID} and GID:${PGID} in workspace ${WORKSPACE_DIR}"
exec su-exec "${PUID}:${PGID}" /opt/siyuan/kernel --workspace="${WORKSPACE_DIR}" ${ARGS}
