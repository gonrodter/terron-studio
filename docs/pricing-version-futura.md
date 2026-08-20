# Versión futura de precios (archivada el 20-08-2026)

Esta es la versión de precios anterior a la simplificación temporal. Está pensada
para recuperarla cuando Terron Studio alcance el nivel adecuado.

## Estructura original

La sección tenía cuatro pestañas. La tarjeta de **Suscripción Terron** aparecía
siempre debajo del contenido de la pestaña activa.

### Página web / Landing Page

- Precio base: **1.200 €**.
- Extra de desarrollo: **+850 €**.
- Página extra: **+250 €/página**.
- Plazo: **5–7 días**.
- Etiqueta de precio: «Diseño de página web».
- Puntos incluidos:
  - Wireframe y diseño a medida.
  - Adaptado a móvil, tablet y escritorio.
  - Revisiones sin límite.
  - Actualizaciones cada 24 horas.

### Web App

- No tenía precio puntual.
- Mostraba la **Suscripción Terron**.

### App móvil

- No tenía precio puntual.
- Mostraba la **Suscripción Terron**.

### Capturas App Store

- Precio base: **550 €** por 6 pantallas.
- Pantalla extra: **+90 €/pantalla**.
- Plazo: **2–5 días**.
- Puntos incluidos:
  - 6 pantallas incluidas.
  - Tamaños iOS y Android.
  - Mockups de dispositivo y textos.
  - Revisiones sin límite.

### Suscripción Terron

- Una tarea activa: **2.800 €/mes**.
- Cada tarea activa adicional: **+1.500 €/mes**.
- Puntos incluidos:
  - Todos los servicios incluidos: diseño y desarrollo.
  - Adaptado a móvil, tablet y escritorio.
  - Revisiones ilimitadas, actualizaciones cada 24 h.
  - Pausa o cancela cuando quieras.

## Configuración original de `App.vue`

```js
const pricingNums = {
  landing: { base: 1200, addons: { dev: { price: 850 }, pages: { price: 250 } } },
  webapp: { retainerOnly: true },
  mobile: { retainerOnly: true },
  screenshots: { base: 550, addons: { pages: { price: 90 } } },
};
```

La tarjeta de suscripción no tenía condición y se renderizaba siempre:

```vue
<div class="retainer-card">
  <!-- configuración y resumen de la Suscripción Terron -->
</div>
```

Para recuperar exactamente la lógica anterior, hay que restaurar la
configuración anterior, los textos y extras indicados en este documento y
eliminar la condición `v-if="activeTier.retainerOnly"` de `retainer-card`.
