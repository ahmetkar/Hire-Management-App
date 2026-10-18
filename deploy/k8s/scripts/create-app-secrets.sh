#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

NAMESPACE="app"

k() {
  sudo k3s kubectl "$@"
}

if ! k get namespace "$NAMESPACE" >/dev/null 2>&1; then
  echo "HATA: app namespace bulunamadı."
  exit 1
fi

# Mevcut Kubernetes secret'larından parolaları oku.
MONGO_PW_B64="$(
  k get secret hm-app-password -n app \
    -o jsonpath='{.data.password}' 2>/dev/null || true
)"

if [[ -z "$MONGO_PW_B64" ]]; then
  echo "HATA: app namespace içindeki hm-app-password"
  echo "secret'ında password anahtarı bulunamadı."
  exit 1
fi

MONGO_PASSWORD="$(printf '%s' "$MONGO_PW_B64" | base64 --decode)"

ES_PW_B64="$(
  k get secret hm-elasticsearch-es-elastic-user -n data \
    -o jsonpath='{.data.elastic}' 2>/dev/null || true
)"

if [[ -z "$ES_PW_B64" ]]; then
  echo "HATA: Elasticsearch parola secret'ı bulunamadı."
  exit 1
fi

ES_PASSWORD="$(printf '%s' "$ES_PW_B64" | base64 --decode)"

# Gerekli uygulama sırlarını kullanıcıdan gizli şekilde al.
read -r -s -p "ACCESS_TOKEN_SECRET gir: " ACCESS_TOKEN_SECRET
printf '\n'
read -r -s -p "REFRESH_TOKEN_SECRET gir: " REFRESH_TOKEN_SECRET
printf '\n'
read -r -s -p "INTERNAL_API_KEY gir: " INTERNAL_API_KEY
printf '\n'
read -r -s -p "Mistral API_KEY gir: " API_KEY
printf '\n'

for name in ACCESS_TOKEN_SECRET REFRESH_TOKEN_SECRET \
            INTERNAL_API_KEY API_KEY; do
  if [[ -z "${!name}" ]]; then
    echo "HATA: $name boş bırakılamaz."
    exit 1
  fi
done

# MongoDB URI içinde özel karakter bulunan parolayı kodla.
MONGO_PASSWORD_URI="$(
  printf '%s' "$MONGO_PASSWORD" |
    python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read(), safe=""))'
)"

DATABASE_URL="mongodb://hm-app:${MONGO_PASSWORD_URI}@hm-mongodb-0.hm-mongodb-svc.data.svc.cluster.local:27017/hiremanagement?replicaSet=hm-mongodb&authSource=admin"

# Secret içeriklerini yalnızca erişimi kısıtlanmış geçici dosyalara yaz.
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

write_value() {
  printf '%s' "$2" > "$TMP_DIR/$1"
}

write_value ACCESS_TOKEN_SECRET "$ACCESS_TOKEN_SECRET"
write_value REFRESH_TOKEN_SECRET "$REFRESH_TOKEN_SECRET"
write_value INTERNAL_API_KEY "$INTERNAL_API_KEY"
write_value API_KEY "$API_KEY"
write_value DATABASE_URL "$DATABASE_URL"
write_value ELASTIC_USERNAME "elastic"
write_value ELASTIC_PASSWORD "$ES_PASSWORD"

apply_secret() {
  local name="$1"
  shift

  k create secret generic "$name" \
    -n "$NAMESPACE" \
    "$@" \
    --dry-run=client -o yaml |
    k apply -f -
}

echo "Uygulama secret'ları oluşturuluyor..."

apply_secret hm-auth-secret \
  --from-file=ACCESS_TOKEN_SECRET="$TMP_DIR/ACCESS_TOKEN_SECRET" \
  --from-file=REFRESH_TOKEN_SECRET="$TMP_DIR/REFRESH_TOKEN_SECRET"

apply_secret hm-internal-secret \
  --from-file=INTERNAL_API_KEY="$TMP_DIR/INTERNAL_API_KEY"

apply_secret hm-ai-secret \
  --from-file=API_KEY="$TMP_DIR/API_KEY"

apply_secret hm-db-secret \
  --from-file=DATABASE_URL="$TMP_DIR/DATABASE_URL"

apply_secret hm-elasticsearch-app-auth \
  --from-file=ELASTIC_USERNAME="$TMP_DIR/ELASTIC_USERNAME" \
  --from-file=ELASTIC_PASSWORD="$TMP_DIR/ELASTIC_PASSWORD"

echo
echo "Secret oluşturma işlemi tamamlandı."
echo "Secret değerleri gösterilmeyecek."
