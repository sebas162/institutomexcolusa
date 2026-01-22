# 📦 Instrucciones de Deploy Estático

## ✅ Proyecto configurado para export estático

### Configuración completada:

**next.config.ts:**
```typescript
output: "export"
trailingSlash: true
images: { unoptimized: true }
```

**Scripts disponibles:**
```bash
npm run build   # Genera export estático en /out
npm run export  # Alias de build
```

### 🎯 Resultado del build:

- ✅ Carpeta generada: `/out` (379MB)
- ✅ Total de páginas HTML: 26 archivos index.html
- ✅ Todas las rutas con trailing slash

### 📂 Rutas principales confirmadas:

```
/out/
├── index.html                              ✅ /
├── about/index.html                        ✅ /about/
├── contact/index.html                      ✅ /contact/
├── congress/index.html                     ✅ /congress/
├── online-training/index.html              ✅ /online-training/
├── staff/index.html                        ✅ /staff/
├── academic-programs/index.html            ✅ /academic-programs/
├── academic-programs/colombia/index.html   ✅ /academic-programs/colombia/
├── academic-programs/mexico/index.html     ✅ /academic-programs/mexico/
└── academic-programs/usa/index.html        ✅ /academic-programs/usa/
```

### 🔍 Verificación de características server-only:

- ✅ No usa `headers()`
- ✅ No usa `cookies()`
- ✅ No usa `redirect()` server-side
- ✅ No usa `generateMetadata` dinámica
- ✅ Solo usa hooks client-side: `useRouter`, `usePathname`, `useSearchParams`

### 🚀 Deploy a Neubox:

**Paso 1: Build local**
```bash
cd /Users/sebastian/Projects/mexcolusa/institutomexcolusa
npm run build
```

**Paso 2: Subir vía FTP**
```
Origen:  /out/*
Destino: /home/insti361/domains/institutomexcolusa.com/public_html/
```

**Paso 3: Verificar .htaccess**
El archivo `.htaccess` ya está en la raíz del proyecto con:
- Trailing slash forzado
- HTTPS redirect
- WWW redirect

Copiar a: `/home/insti361/domains/institutomexcolusa.com/public_html/.htaccess`

### ✅ Confirmaciones finales:

1. **Todas las páginas principales generadas**: ✅
2. **Canonicals con trailing slash**: ✅
3. **Structure folder/index.html**: ✅
4. **/academic-programs/index.html existe**: ✅
5. **No server-only features**: ✅
6. **Build exitoso**: ✅

---

**Última build:** 10 de enero de 2026
**Tamaño total:** 379MB
**Páginas generadas:** 26
