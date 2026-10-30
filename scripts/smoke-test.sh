#!/usr/bin/env bash
# QuantumShop smoke test: gateway üzerinden kayıt/giriş, ürünler ve sipariş yaşam döngüsü.
# Kullanım: ./scripts/smoke-test.sh [gateway_url]   (varsayılan: http://localhost:8090)
BASE=${1:-http://localhost:8090}
PASS=0
FAIL=0
J='Content-Type: application/json'

check() {   # check "<ad>" <beklenen> <gelen>
  if [ "$2" = "$3" ]; then
    echo "  ok    $1"; PASS=$((PASS+1))
  else
    echo "  FAIL  $1 (beklenen $2, gelen $3)"; FAIL=$((FAIL+1))
  fi
}
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }
field() { sed -nE "s/.*\"$1\":\"?([^\",}]+)\"?.*/\1/p"; }   # basit JSON alan okuyucu
present() { [ -n "$1" ] && echo yes || echo no; }

U="smoke$(date +%s)"

echo "== auth"
RESP=$(curl -s -X POST "$BASE/api/auth/register" -H "$J" \
  -d "{\"username\":\"$U\",\"email\":\"$U@example.com\",\"password\":\"Smoke12345\"}")
TOKEN=$(echo "$RESP" | field token)
check "register returns a token" yes "$(present "$TOKEN")"
A="Authorization: Bearer $TOKEN"
check "login" 200 "$(code -X POST "$BASE/api/auth/login" -H "$J" -d "{\"username\":\"$U\",\"password\":\"Smoke12345\"}")"
check "login with wrong password" 401 "$(code -X POST "$BASE/api/auth/login" -H "$J" -d "{\"username\":\"$U\",\"password\":\"wrong\"}")"

echo "== products"
check "list products" 200 "$(code "$BASE/api/products" -H "$A")"

echo "== orders"
OID=$(curl -s -X POST "$BASE/api/orders" -H "$A" -H "$J" -d '{"productName":"Smoke Item","quantity":1}' | field id)
check "create order" yes "$(present "$OID")"
check "get order" 200 "$(code "$BASE/api/orders/$OID" -H "$A")"
check "reject blank product name" 400 "$(code -X POST "$BASE/api/orders" -H "$A" -H "$J" -d '{"productName":"","quantity":1}')"
check "mark as paid" 200 "$(code -X PATCH "$BASE/api/orders/$OID/status" -H "$A" -H "$J" -d '{"status":"PAID"}')"
check "reject edit after payment" 409 "$(code -X PUT "$BASE/api/orders/$OID" -H "$A" -H "$J" -d '{"productName":"X","quantity":1}')"
check "reject delete of a paid order" 409 "$(code -X DELETE "$BASE/api/orders/$OID" -H "$A")"
check "cancel" 200 "$(code -X PATCH "$BASE/api/orders/$OID/status" -H "$A" -H "$J" -d '{"status":"CANCELLED"}')"
check "delete cancelled order" 204 "$(code -X DELETE "$BASE/api/orders/$OID" -H "$A")"
check "deleted order is gone" 404 "$(code "$BASE/api/orders/$OID" -H "$A")"

echo
echo "passed: $PASS   failed: $FAIL"
[ "$FAIL" -eq 0 ]
