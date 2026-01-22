# ✅ CHECKLIST DE VALIDACIÓN DE HEROES – DESPUÉS DE OPTIMIZACIÓN

**Estado:** Listos para validar  
**Cambios:** Heroes ahora usan `.webp` (cuando navegador lo soporta) + fallback PNG/JPG  
**Meta:** Confirmar que todo se ve correcto en desktop/móvil antes de eliminar originales

---

## 1️⃣ HOME (Crítico)

### Desktop (Chrome, Safari, Firefox)

- [ ] **Frame se carga rápido** (sin parpadeo blanco)
- [ ] **Imagen de fondo completa** (sin cortes ni deformaciones)
- [ ] **Texto (h1, p, botones) visible** y con buen contraste
- [ ] **Sin bordes negros laterales**
- [ ] **Logo arriba a la derecha visible**

### Móvil (iOS Safari, Chrome Android)

- [ ] **Hero ocupa pantalla completa**
- [ ] **Imagen se ajusta al ancho sin deformarse**
- [ ] **Texto legible sin overflow**
- [ ] **Sin salto de layout al cargar imagen**
- [ ] **Botones funcionales**

**URL:** `/` (raíz)

---

## 2️⃣ SECCIONES PRINCIPALES

### About Page

- [ ] **Desktop:** Hero completo, proporción correcta
- [ ] **Móvil:** Se ajusta bien, sin cortes
- **URL:** `/about`

### Programas Académicos

- [ ] **Desktop:** Heroes de tarjetas visibles, grid limpio
- [ ] **Móvil:** Cards stackeadas, imágenes visibles
- **URL:** `/academic-programs`

### Formación en Línea

- [ ] **Desktop:** Hero elegante
- [ ] **Móvil:** Responsive sin problemas
- **URL:** `/online-training`

### Congreso

- [ ] **Desktop:** Hero de conferencia visible
- [ ] **Móvil:** Sin deformaciones
- **URL:** `/congress`

### Staff/Directores

- [ ] **Desktop:** Fotos de directores cargan
- [ ] **Móvil:** Grid responsive
- **URL:** `/staff`

### Contacto

- [ ] **Desktop:** Hero con formulario
- [ ] **Móvil:** Formulario visible, no obstaculizado
- **URL:** `/contact`

---

## 3️⃣ CURSOS POR PAÍS

### MÉXICO – Armonización Facial

- [ ] **Hero:** Master class image se ve completo
- [ ] **Proporción:** No estirada ni cortada
- [ ] **Móvil:** Se ajusta al ancho sin overflow
- [ ] **Frame:** Claro, sin pixelación
- **URL:** `/academic-programs/mexico/facial-harmonization-course/`

### MÉXICO – Sueroterapia

- [ ] **Hero:** Suero MX image correcto
- [ ] **Responsive:** Desktop → Móvil sin saltos
- **URL:** `/academic-programs/mexico/intravenous-therapy-mexico/`

### COLOMBIA – Master Class

- [ ] **Hero:** Master class Colombia visible
- [ ] **Proporción:** Elegante, sin distorsión
- [ ] **Móvil:** Frame correcto
- **URL:** `/academic-programs/colombia/master-class-facial-modeling/`

### COLOMBIA – Sueroterapia

- [ ] **Hero:** Suero Colombia correcto
- [ ] **Móvil:** Sin cortes en bordes
- **URL:** `/academic-programs/colombia/intravenous-therapy-online/`

### USA – Master Class

- [ ] **Hero:** Master class USA visible
- [ ] **Responsive:** Desktop y móvil limpios
- **URL:** `/academic-programs/usa/master-class-4-techniques/`

### USA – Chelation

- [ ] **Hero:** Imagen de chelation visible
- [ ] **Proporción:** Correcta en todos los tamaños
- **URL:** `/academic-programs/usa/intravenous-therapy-chelation/`

---

## 4️⃣ VALIDACIÓN MÓVIL GLOBAL

Probar en **iPhone (iOS) y Android** al menos una vez:

- [ ] **Todos los heroes aparecen** (no desaparecen)
- [ ] **Frame del video/imagen visible** (no negro completo)
- [ ] **Sin pixelación o degradación** visual
- [ ] **Sin cortes en bordes** (imagen se ajusta bien)
- [ ] **Consistencia de diseño** (todos los heroes siguen el mismo patrón)
- [ ] **Rendimiento:** Carga rápida (< 2s)
- [ ] **Scroll suave** al pasar entre secciones

---

## 5️⃣ VERIFICACIÓN TÉCNICA (DevTools)

### Chrome/Firefox DevTools (Network Tab)

- [ ] **.webp carga en navegadores modernos** (ver en Network)
- [ ] **PNG/JPG carga como fallback en navegadores viejos**
- [ ] **Tamaño de imagen es ~98% más pequeño** que original
- [ ] **Waterfall:** Hero image NO bloquea otras cargas

### Console (F12)

- [ ] **Sin errores rojos** relacionados a imágenes
- [ ] **Sin warnings** de CORS o recursos faltantes

---

## 6️⃣ OPTIMIZACIONES CONFIRMADAS

| Métrica    | Antes                   | Después      | Mejora        |
| ---------- | ----------------------- | ------------ | ------------- |
| Original   | 155.96 MB               | -            | -             |
| Optimizado | -                       | 2.53 MB      | ✅ 98.4%      |
| LCP Impact | Alto (imágenes pesadas) | Bajo (.webp) | ✅ Más rápido |

---

## ✅ CHECKLIST FINAL

Una vez validado todo:

- [ ] **Todos los heroes se ven correctos**
- [ ] **Desktop OK**
- [ ] **Móvil OK**
- [ ] **Rendimiento mejorado**
- [ ] **Console sin errores**

Si todo está ✅, el siguiente paso es:

```bash
# Eliminar PNG/JPG originales para ahorrar 153 MB
find src/assets -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -delete

# Verificar que solo .webp quedan
find src/assets -name "*.webp" | wc -l
```

---

## 🚀 DEPLOY

Una vez validado y limpiado:

```bash
npm run build
# Deploy to your host
```

**Peso antes:** ~156 MB  
**Peso después:** ~2.5 MB  
**Ahorro:** **~153 MB (98.4%)**
