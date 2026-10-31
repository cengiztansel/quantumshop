#!/usr/bin/env bash
# Kullanım: ./scripts/make-admin.sh <kullanıcı_adı>   (kullanıcı önce kayıt olmuş olmalı)
set -e
NAME=${1:?usage: make-admin.sh <username>}
[[ "$NAME" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "invalid username"; exit 1; }
kubectl exec -n quantumshop deployment/user-db -- psql -U cengiz -d user_db \
  -c "UPDATE users SET role='ADMIN' WHERE username='${NAME}';"
echo "Log out and log in again so the new role is in your token."
