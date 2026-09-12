# Ajustes de contenido — Cursos Mini Lifting, Sueroterapia y Armonización Facial

**Fecha:** Septiembre 2026
**Commit:** 0d769f3
**Archivos afectados:** `src/lib/i18n/{es,en}/academicPrograms.ts`, `src/lib/i18n/{es,en}/home.ts`

## 1. Mini Lifting 3 Puntos (USA, México, Colombia)

Cambio principal: el curso pasó de presencial a 100% online.

| Campo | Antes | Después |
| --- | --- | --- |
| Título (card, hero, home) | "Curso con técnicas de rejuvenecimiento..." | "Curso online con técnicas de rejuvenecimiento..." |
| Formato | Presencial | Online |
| Duración | 2 días teórico y práctico | 2 días teórico - demostrativo (video) |
| Ubicación | Colombia - México | Colombia - Remoto (igual en los 3 países) |
| Dirigido a | Médico cirujano (amplio: dermatólogos, odontólogos, etc.) | Médico cirujano plástico (específico) |
| Estructura del curso | "Contenido del curso" | "Estructura del curso" |
| Incluye | Práctica personalizada | Video de práctica |
| Avales y Respaldos | Incluía párrafo de Secretaría del Trabajo (STPS) | Removido — no aplicaba a USA/Colombia |
| Productos de Calidad y Seguridad | Visible | Oculto (se eliminó el campo `productQuality`) |

Se corrigió además la frase que decía "este curso se imparte únicamente en nuestras sedes de Colombia y México" — contradecía el nuevo formato online y aparecía incluso en la página de USA.

## 2. Sueroterapia / Medicina Regenerativa (USA, México, Colombia)

Cambio principal: unificación de formato y título, USA y México pasan de "Presencial y online" a 100% Online (Colombia ya era online).

| Campo | Antes | Después |
| --- | --- | --- |
| Título (card, hero, home de México) | "Curso sueroterapia, quelación..." (variaba por país) | "Curso online sueroterapia-quelación..." (igual en los 3) |
| Formato (USA, México) | Presencial y online | Online |
| Horario | Variaba (Colombia 9:45am, resto 9:00am) | Unificado a 9:00 am - 6:00 pm |
| Dirigido a | Profesionales de la salud | Profesionales Médicos |
| Productos de Calidad | Texto con inconsistencias entre países, México con párrafo extra sin sentido en ese lugar | Texto unificado en los 3, párrafo sobrante de México eliminado |

## 3. Armonización Facial / Master Class 4 Técnicas (SOLO México y Colombia — USA no se tocó)

| Campo | Antes | Después |
| --- | --- | --- |
| Formato (Colombia) | "presencial" (minúscula, inconsistente) | "Presencial" |
| Duración | "2 días teórico y práctico" (ambiguo) | "2 días teóricos y 2 días prácticos" (aclara que son 4 días en total) |
| Dirigido a | Médicos y odontólogos | Médicos especialistas |
| Currículo | — | Se agregó nota de cierre: "Las aplicaciones prácticas se determinarán de acuerdo con el perfil profesional, formación y ámbito de competencia de cada participante." |

## 4. Ajustes técnicos transversales

- **Negritas restauradas:** varios reemplazos de texto durante el proceso perdieron el formato en negrita (`**texto**`) que tenía el contenido original. Se restauró en los 3 cursos sin modificar el texto en sí.
- **home.ts:** las cards de "Programas Destacados" de México (Sueroterapia) y Colombia (Mini Lifting) se actualizaron para reflejar los nuevos títulos.
- **Ningún cambio afectó:** `price`, `capacity`, `heroImage`, `includes` (salvo Mini Lifting), `accreditations` de Sueroterapia/Armonización, ni el curso de USA de Armonización Facial.

## Pendientes relacionados (no resueltos en este ajuste)

- Dependabot reporta 132 vulnerabilidades en el repo (2 críticas, 75 altas, 44 moderadas, 11 bajas) — preexistente, no introducido por este cambio. Pendiente sesión dedicada de `npm audit`.
- El párrafo de Secretaría del Trabajo (STPS) sigue existiendo correctamente en Armonización Facial México (ahí sí aplica) — solo se removió donde estaba mal aplicado (Sueroterapia y Mini Lifting en USA/Colombia).
