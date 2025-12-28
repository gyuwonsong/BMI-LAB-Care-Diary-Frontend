#!/usr/bin/env bash
set -euo pipefail

BASE="https://diary-api.snuh-bmilab.ai.kr"

CANDIDATES=(
  "$BASE/v3/api-docs"
  "$BASE/v3/api-docs.yaml"
  "$BASE/api-docs"
  "$BASE/api-docs.yaml"
)

OUT_SPEC="openapi.json"
OUT_DIR="src/generated-api"

echo "==> Trying to fetch OpenAPI spec from candidates..."
FOUND=""

for URL in "${CANDIDATES[@]}"; do
  echo "  - $URL"
  if curl -fsSL "$URL" -o "$OUT_SPEC" ; then
    FOUND="$URL"
    break
  fi
done

if [[ -z "$FOUND" ]]; then
  echo "❌ OpenAPI 스펙 URL을 못 찾았습니다."
  echo "Swagger UI에서 Network 탭을 열고 'api-docs' 또는 'swagger-config' 요청 URL을 확인한 뒤,"
  echo "CANDIDATES에 그 URL을 추가하세요."
  exit 1
fi

echo "✅ Spec downloaded from: $FOUND"
echo "==> Generating client to: $OUT_DIR"

yarn openapi-generator-cli generate \
  -i "$OUT_SPEC" \
  -g typescript-fetch \
  -o "$OUT_DIR" \
  --additional-properties=supportsES6=true,typescriptThreePlus=true,useSingleRequestParameter=true

echo "✅ Done."
