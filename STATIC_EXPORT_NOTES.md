# Configuración para Static Export

## ✅ Cambios Implementados

### 1. Rutas Dinámicas - Patrón Server/Client Component

Se implementó la separación de Server y Client Components para las rutas dinámicas:

#### Estructura:

```
/academic-programs/[country]/[slug]/
  ├── page.tsx          (Server Component - generateStaticParams)
  └── ClientPage.tsx    (Client Component - toda la lógica UI y hooks)
```

#### Países configurados:

- **USA**: 4 slugs

  - master-class-4-techniques
  - intravenous-therapy-chelation
  - mini-lifting-usa
  - phlebotomy-course

- **México**: 3 slugs

  - facial-harmonization-course
  - intravenous-therapy-mexico
  - mini-lifting-techniques

- **Colombia**: 3 slugs
  - master-class-facial-modeling
  - intravenous-therapy-online
  - mini-lifting-colombia

### 2. Next.js 15 - Async Params

Los parámetros en Next.js 15 son Promises. Cada `page.tsx` usa:

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ClientPage slug={slug} />;
}
```

### 3. Server Actions Deshabilitadas

#### ⚠️ Limitaciones del Static Export

Las Server Actions no son compatibles con `output: 'export'`. Se comentaron las directivas `'use server'` en:

- `/src/lib/actions/contact.actions.ts`
- `/src/lib/actions/coupon.actions.ts`
- `/src/ai/flows/generate-unique-coupon-codes.ts`

#### Cambios específicos:

**coupon.actions.ts:**

- ❌ `revalidatePath()` comentado (no funciona en static export)
- ❌ `redirect()` reemplazado por retorno de `{ redirectUrl }`
- ✅ El cliente maneja la navegación con `router.push()`

**contact.actions.ts:**

- ❌ `sendContactEmail()` comentado (nodemailer no es compatible con bundle del cliente)
- ⚠️ El formulario valida pero NO envía emails
- 💡 **Solución recomendada**: Integrar con servicio externo (SendGrid, Mailgun, etc.)

### 4. Build exitoso

```bash
npm run build
```

**Resultados:**

- ✅ 29 páginas generadas
- ✅ 10 rutas dinámicas (SSG con generateStaticParams)
- ✅ Sin errores de compilación

## 🔧 Funcionalidades Afectadas

### ❌ No Disponibles en Static Export:

1. **Email de contacto**: El formulario NO envía emails

   - Valida datos correctamente
   - Necesita integración con API externa

2. **Cupones con backend**: CRUD de cupones deshabilitado

   - Firebase funciona en el cliente
   - Pero revalidatePath/redirect no funcionan

3. **Admin Dashboard**: Funcionalidad limitada
   - Lectura de datos: ✅
   - Escritura de datos: ⚠️ (sin revalidación)

## 💡 Soluciones Recomendadas

### Opción 1: Mantener Static Export + Servicios Externos

**Para emails:**

```typescript
// Usar servicio como SendGrid API directamente desde el cliente
await fetch("https://api.sendgrid.com/v3/mail/send", {
  method: "POST",
  headers: { Authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify(emailData),
});
```

**Para cupones:**

- Mantener Firebase para lecturas
- Crear Cloud Functions de Firebase para escrituras
- Llamarlas desde el cliente con `fetch()`

### Opción 2: Cambiar a Deployment Normal

Si necesitas Server Actions, API Routes, o revalidación:

```typescript
// next.config.ts
const nextConfig = {
  // Remover: output: "export",
  images: {
    formats: ["image/avif", "image/webp"],
    // Remover: unoptimized: true,
  },
};
```

**Deploy en:**

- Vercel (recomendado para Next.js)
- Netlify
- Railway
- Render

## 📊 Páginas Generadas

Total: **29 páginas estáticas**

- Home: `/`
- About: `/about`
- Academic Programs: `/academic-programs`
  - Country pages: 3 (USA, México, Colombia)
  - Course detail pages: 10 (4+3+3)
- Congress: `/congress`
- Contact: `/contact` ⚠️
- Online Training: `/online-training`
- Staff: `/staff`
- Admin: `/admin/dashboard` ⚠️
- Login: `/login` ⚠️
- Special Class: `/class/special` ⚠️
- Legal: `/privacy`, `/terms`

⚠️ = Funcionalidad limitada en static export

## 🚀 Deploy

El sitio está listo para deploy en cualquier hosting de archivos estáticos:

```bash
npm run build
# Los archivos están en: /out
```

**Hosts compatibles:**

- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Netlify (static)
- Vercel (static)

## 📝 Notas Finales

- ✅ Performance optimizado (Lighthouse ready)
- ✅ SEO friendly (pre-renderizado)
- ✅ Meta Pixel integrado
- ⚠️ Funcionalidades server-side requieren servicios externos
- 📖 Revisar `/docs/blueprint.md` para arquitectura completa
