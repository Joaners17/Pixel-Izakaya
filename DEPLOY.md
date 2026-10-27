# Publicar Pixel Izakaya (GitHub + Render + Vercel)

## 1. GitHub
Sube esta carpeta a un repositorio (el `package.json` debe quedar en la raíz).
`.gitignore` ya excluye `node_modules`.

## 2. Render (servidor)
**Opción A – Blueprint:** New > Blueprint > elige el repo (usa `render.yaml`).
**Opción B – manual:** New > Web Service > Build `npm install` · Start `npm run start:backend` · Plan Free.
Variables de entorno:
- `SAVE_SECRET`: texto largo aleatorio (el Blueprint lo genera). No lo cambies o se invalidan las partidas guardadas.
- `ALLOWED_ORIGIN`: la URL de Vercel, sin `/` al final (se puede poner después).

Comprueba `https://TU-SERVICIO.onrender.com/health` → debe decir `ok`.

## 3. Conectar el frontend
En `frontend/config.js`:
    window.IZAKAYA_API = 'https://TU-SERVICIO.onrender.com';
Haz commit y push.

## 4. Vercel (juego)
Add New > Project > importa el repo · Root Directory: `frontend` · Framework: Other · sin Build Command ni Output Directory.
Copia la URL de Vercel y ponla en `ALLOWED_ORIGIN` en Render.

## Notas
- Las partidas (3 slots) se guardan en el navegador de cada jugador; el servidor las firma para que no se puedan editar.
  Si borras los datos del sitio o cambias de navegador/dispositivo, no se recuperan.
- Render gratis se duerme tras ~15 min sin uso: el primer acceso tarda cerca de 1 minuto. El juego avisa y retoma solo.
- Todo en un solo servicio (sin Vercel): deja `config.js` con `''` y abre la URL de Render.
