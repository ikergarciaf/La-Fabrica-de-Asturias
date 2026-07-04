<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/205f700c-9cec-4dd8-9355-10254e9fbae7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Nuevos platos añadidos

A continuación se listan los platos recientemente añadidos al menú y sus imágenes asociadas:

- **Bocadillo de cachopo**: Solomillo ibérico, relleno de jamón ibérico y queso gamoneo. Contiene gluten y lactosa. Imagen: `img/bocadillo_cachopo.jpeg`.
- **Bocadillo de chorizo a la sidra**: Chorizo asturiano cocido con sidra asturiana. Contiene gluten. Imagen: `img/bocadillo_chorizo_sidra.jpg`.
- **Patatas al cabrales**: Patatas fritas con salsa de cabrales. Contiene lactosa. Imagen: `img/patatas_cabrales.jpg`.

Las imágenes están disponibles tanto en `img/` como en `La-Fabrica-de-Asturias/img/` para compatibilidad con ambas rutas del proyecto.
