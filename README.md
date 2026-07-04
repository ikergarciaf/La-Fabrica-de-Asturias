# La Fábrica de Asturias

Web oficial de **La Fábrica de Asturias**, food truck de street food gourmet asturiano (hamburguesas, cachopos, bocadillos y patatas) ubicado en Móstoles, Madrid.

Construida con React 19, TypeScript, Vite y Tailwind CSS 4.

## Requisitos

- Node.js 18 o superior

## Desarrollo local

```bash
npm install
npm run dev
```

La app quedará disponible en `http://localhost:3000`.

## Compilar para producción

```bash
npm run build
```

Los ficheros optimizados se generan en `dist/`, listos para desplegar en Vercel, Netlify o cualquier hosting estático.

```bash
npm run preview   # sirve dist/ localmente para comprobar el build
```

## Comprobación de tipos

```bash
npm run lint
```

## Estructura del proyecto

```
src/
  App.tsx          # Componente principal (secciones de la web)
  constants.ts      # Datos del menú, testimonios y marca
  index.css         # Estilos globales y tema de Tailwind
  main.tsx          # Punto de entrada de React
public/
  img/              # Imágenes servidas de forma estática (logo, platos, food truck)
  robots.txt, sitemap.xml, *.html   # SEO y páginas legales (privacidad, cookies, términos)
```

### Añadir o editar un plato del menú

Los platos se definen en `src/constants.ts`, dentro de `MENU_ITEMS`. Cada plato necesita su imagen dentro de `public/img/` (esta es la única carpeta que Vite sirve como estática; una imagen colocada fuera de `public/` no se mostrará en la web).
