# =========================================================================
# HOW TO CONNECT TO THIS DATABASE:
# =========================================================================
# Host:       localhost (or 127.0.0.1)
# Port:       5432
# Username:   admin_user (set via POSTGRES_USER environment variable)
# Password:   a_very_strong_password_here (set via POSTGRES_PASSWORD)
# Database:   production_db (set via POSTGRES_DB)
# 
# Connection URI Format:
# postgresql://admin_user:a_very_strong_password_here@localhost:5432/production_db
# =========================================================================

FROM postgres:17-alpine

# Update base system for security patches
RUN apk update && apk upgrade

# Optional: Place schema or seed scripts here to run on first boot
# COPY ./init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

# docker build -t database -f docker/db.dockerfile . 
# docker run -p 5432:5432 -t database 