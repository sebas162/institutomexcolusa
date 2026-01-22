# Video Posters - Home Page

## 📍 Ubicación

- **Posters actuales**: `public/video-posters/`
- **Uso**: Home page testimonial videos

## 🎬 Videos y Posters

### Video 1: Anuncio Institucional

- **Video**: `/anuncio-mexcol.mp4`
- **Poster**: `/video-posters/anuncio-mexcol-poster.webp`
- **Actual**: Placeholder (hero-home.webp)
- **Tamaño**: 69K

### Video 2: Testimonios Ponentes

- **Video**: `/Ponentes.mp4`
- **Poster**: `/video-posters/ponentes-poster.webp`
- **Actual**: Placeholder (hero-programas-academico.webp)
- **Tamaño**: 56K

## 🔄 Para Reemplazar con Frames Reales

Cuando tengas acceso a **ffmpeg**, ejecuta:

```bash
# Video 1 - Anuncio
ffmpeg -i public/anuncio-mexcol.mp4 -ss 00:00:02 -vframes 1 /tmp/anuncio.jpg
npx sharp-cli -i /tmp/anuncio.jpg -o public/video-posters/anuncio-mexcol-poster.webp -f webp --quality 75

# Video 2 - Ponentes
ffmpeg -i public/Ponentes.mp4 -ss 00:00:02 -vframes 1 /tmp/ponentes.jpg
npx sharp-cli -i /tmp/ponentes.jpg -o public/video-posters/ponentes-poster.webp -f webp --quality 75
```

O usa cualquier editor de video para exportar un frame específico.

## ✅ Beneficios Actuales

- ✅ Videos con `preload="none"` (ahorra ancho de banda)
- ✅ Posters visible antes de reproducir
- ✅ Mejora UX en conexiones lentas
- ✅ Formato .webp optimizado

## 📝 Notas

Los posters actuales son placeholders funcionales. Los videos funcionan perfectamente, pero recomendamos:

1. Extraer un frame representativo de cada video
2. Optimizar a .webp con calidad 70-80
3. Mantener resolución 1280x720 o similar
