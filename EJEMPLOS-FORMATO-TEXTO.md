# 📝 Ejemplos de Uso - Formato de Textos (Negrita, Cursiva, etc.)

## ✅ Método Recomendado: Usar Marcadores Especiales

He creado una función helper en `src/lib/utils/text-formatting.tsx` que puedes usar fácilmente.

### Marcadores disponibles:

- `**texto**` → **texto en negrita**
- `*texto*` → *texto en cursiva*
- `***texto***` → ***texto en negrita y cursiva***
- `` `texto` `` → `texto como código`

---

## Ejemplo 1: Usando formatText() en un componente

```tsx
// src/app/ejemplo/page.tsx
'use client';
import { formatText } from '@/lib/utils/text-formatting';
import { translations } from '@/lib/i18n';
import { useLanguage } from '@/hooks/use-language';

export default function EjemploPage() {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <div>
      {/* Texto simple */}
      <h1>{t.home.hero.main}</h1>
      
      {/* Texto con formato */}
      <p>{formatText('Aprende con los **mejores profesionales** en *medicina estética*')}</p>
      
      {/* Usando texto de traducción con formato */}
      <p>{formatText(t.home.hero.sub)}</p>
    </div>
  );
}
```

---

## Ejemplo 2: Usando el componente FormattedText

```tsx
// src/app/ejemplo/page.tsx
'use client';
import { FormattedText } from '@/lib/utils/text-formatting';
import { translations } from '@/lib/i18n';
import { useLanguage } from '@/hooks/use-language';

export default function EjemploPage() {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <div>
      <FormattedText>
        {t.home.hero.sub}
      </FormattedText>
    </div>
  );
}
```

---

## Ejemplo 3: Agregar formato en tus archivos de traducción

```typescript
// src/lib/i18n/es/home.ts
export const home = {
  hero: {
    main: 'Instituto Mex - Col - Usa',
    // Agrega marcadores especiales directamente en el texto
    sub: 'Educación continua en **medicina estética**',
    description: 'Explora nuestros ***programas únicos*** diseñados para profesionales',
    intro: 'Aprende con los *mejores expertos* y técnicas `avanzadas`',
  },
  onlineTraining: {
    title: 'Formación en línea',
    intro: 'Únete a esta experiencia **única** de aprendizaje diseñada para brindarte herramientas *prácticas*',
  }
};
```

```tsx
// En tu componente - src/app/page.tsx
import { formatText } from '@/lib/utils/text-formatting';

<p className="text-lg">
  {formatText(t.home.hero.description)}
</p>
```

---

## Ejemplo 4: Combinando texto simple y texto con formato

```tsx
<div>
  <h1>{t.home.hero.main}</h1>
  <p>
    {t.home.onlineTraining.title}: {formatText(t.home.onlineTraining.intro)}
  </p>
</div>
```

---

## Ejemplo 5: Texto con múltiples formatos

```typescript
// En tu traducción
export const home = {
  description: 'Ofrecemos **cursos únicos** con *profesionales destacados* y `técnicas avanzadas` para ***resultados excepcionales***',
};
```

```tsx
// En tu componente
<p>{formatText(t.home.description)}</p>
```

---

## Método Alternativo: JSX Directo (sin marcadores)

Si prefieres tener control total sobre el formato en el componente:

```tsx
<p>
  Aprende con los <strong>mejores profesionales</strong> en 
  <em>medicina estética</em>
</p>
```

**Ventaja:** Más control visual
**Desventaja:** Mezcla idiomas y formato en el componente

---

## 📌 Recomendación Final

**Usa el método de marcadores (`**texto**`, `*texto*`) porque:**
- ✅ Separa el contenido de la presentación
- ✅ Funciona con múltiples idiomas
- ✅ Es fácil de mantener
- ✅ Ya está implementado y listo para usar
- ✅ No hay riesgo de seguridad (XSS)

Solo necesitas:
1. Agregar los marcadores en tus archivos de traducción
2. Importar `formatText` o `FormattedText` en tu componente
3. ¡Listo!









































