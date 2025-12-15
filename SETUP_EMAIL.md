# Configuración del Servidor de Correo para el Formulario de Contacto

Este documento explica cómo configurar Gmail para enviar correos desde el formulario de contacto.

## ⚠️ Problema Común: Error de Autenticación

Si ves el error:
```
Invalid login: 535-5.7.8 Username and Password not accepted
```

**Esto significa que estás usando tu contraseña normal de Gmail. Gmail requiere una "Contraseña de Aplicación" especial para aplicaciones de terceros.**

## 📝 Pasos para Configurar Gmail

### Paso 1: Habilitar Verificación en 2 Pasos

1. Ve a tu cuenta de Google: https://myaccount.google.com/security
2. Busca "Verificación en 2 pasos"
3. Actívala si no está activada (es obligatorio para generar contraseñas de aplicación)

### Paso 2: Generar una Contraseña de Aplicación

1. Ve a: https://myaccount.google.com/apppasswords
2. Si no ves esta opción, primero activa la verificación en 2 pasos (Paso 1)
3. Selecciona "Correo" como aplicación
4. Selecciona "Otro (nombre personalizado)" como dispositivo
5. Escribe un nombre descriptivo (ej: "MexCol Contact Form")
6. Haz clic en "Generar"
7. **Copia la contraseña de 16 caracteres que aparece** (parece: `abcd efgh ijkl mnop`)

### Paso 3: Configurar Variables de Entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Agrega o actualiza las siguientes variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_TO=tu-email@gmail.com
SMTP_FROM_NAME=Formulario de Contacto MexCol
```

**Importante:**
- `SMTP_USER`: Tu correo de Gmail completo (ej: `juan@gmail.com`)
- `SMTP_PASSWORD`: La contraseña de aplicación de 16 caracteres que generaste (sin espacios, o con espacios como la copiaste)
- `SMTP_TO`: El correo donde quieres recibir los mensajes del formulario (puede ser el mismo que SMTP_USER)

### Paso 4: Reiniciar el Servidor

Después de configurar las variables de entorno, **debes reiniciar el servidor Next.js** para que cargue las nuevas variables:

1. Detén el servidor (Ctrl+C)
2. Inícialo nuevamente: `npm run dev`

## 🔒 Seguridad

**NUNCA compartas tu contraseña de aplicación ni la subas a Git.**

- El archivo `.env` ya está en `.gitignore`, así que no se subirá al repositorio
- Si trabajas en un equipo, cada desarrollador debe generar su propia contraseña de aplicación
- Para producción, configura estas variables en tu plataforma de hosting (Vercel, Netlify, etc.)

## ✅ Verificación

Para verificar que todo funciona:

1. Asegúrate de que todas las variables estén configuradas en `.env`
2. Reinicia el servidor Next.js
3. Intenta enviar un mensaje de prueba desde el formulario de contacto
4. Revisa tu bandeja de entrada (y spam) para confirmar que recibiste el correo

## 🆘 Solución de Problemas

### Error: "Credenciales de correo inválidas"
- Verifica que estés usando una **contraseña de aplicación**, no tu contraseña normal
- Asegúrate de haber copiado la contraseña completa (16 caracteres)
- Si la contraseña tiene espacios, puedes eliminarlos o dejarlos

### Error: "No se pudo conectar al servidor"
- Verifica tu conexión a internet
- Verifica que el puerto 587 no esté bloqueado por tu firewall

### No recibo los correos
- Revisa tu carpeta de spam/correo no deseado
- Verifica que `SMTP_TO` tenga el correo correcto
- Revisa la consola del servidor para ver si hay errores

## 📚 Recursos

- [Cómo generar una contraseña de aplicación de Google](https://support.google.com/accounts/answer/185833)
- [Verificación en 2 pasos de Google](https://support.google.com/accounts/answer/185839)



















