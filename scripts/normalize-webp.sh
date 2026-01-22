#!/bin/bash
# Normaliza nombres de archivos .webp: minúsculas, sin espacios, sin acentos
# Genera mapeo de cambios para actualizar referencias en código

set -e

ASSETS_DIR="src/assets"
OUTPUT_LOG="scripts/webp-rename-mapping.txt"

# Función para normalizar nombre de archivo
normalize_filename() {
    local filename="$1"
    local basename="${filename%.*}"
    local ext="${filename##*.}"
    
    # Convertir a minúsculas
    local normalized=$(echo "$basename" | tr '[:upper:]' '[:lower:]')
    
    # Reemplazar espacios con guiones
    normalized=$(echo "$normalized" | sed 's/ /-/g')
    
    # Remover caracteres especiales (mantener solo alphanumeric, guiones, puntos)
    # normalized=$(echo "$normalized" | sed 's/[^a-z0-9._-]//g')
    
    # Trimear guiones duplicados
    normalized=$(echo "$normalized" | sed 's/-\{2,\}/-/g')
    
    echo "${normalized}.${ext}"
}

echo "🔄 Generando mapeo de renombramientos .webp..."
echo "" > "$OUTPUT_LOG"

# Encontrar todos los .webp y generar mapeo
find "$ASSETS_DIR" -name "*.webp" -type f | sort | while read -r filepath; do
    dir=$(dirname "$filepath")
    oldname=$(basename "$filepath")
    newname=$(normalize_filename "$oldname")
    
    if [ "$oldname" != "$newname" ]; then
        echo "RENAME: $filepath → $dir/$newname" >> "$OUTPUT_LOG"
        echo "OLD: $oldname → NEW: $newname"
        
        # Renombrar el archivo
        mv "$filepath" "$dir/$newname"
    else
        echo "SKIP: $oldname (ya normalizado)" >> "$OUTPUT_LOG"
    fi
done

echo ""
echo "✅ Mapeo guardado en: $OUTPUT_LOG"
echo ""
cat "$OUTPUT_LOG"
