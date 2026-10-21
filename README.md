# DUCK · Sound Lab / Archivo de diseño

Esta es una **variante visual de DUCK Studio** procedente de los archivos
de diseño. No debe confundirse con un segundo producto musical independiente.
El producto canónico que concentra el trabajo funcional está en
`belentani7/03-DUCK-WEB-build-everything`.

El repositorio conserva el tratamiento gráfico original del archivo y un
laboratorio Web Audio API con secuenciador, sintetizador, mezclador y grabador.
La interfaz de inicio ahora explica procesos de producción y evita atribuir
a DUCK canciones, métricas o perfiles sociales pertenecientes a Belentani.

## Utilización local

```bash
python3 -m http.server 8080
# abrir http://localhost:8080/
node --test tests/studio.test.mjs
```

No hay backend, autenticación ni almacenamiento de clientes. La importación
de samples, presets y grabación son locales al navegador. Las funciones de
micrófono requieren permisos y pueden exigir origen HTTPS/localhost.

## Política de publicación

- Esta variante **no se indexa**: ambas páginas declaran `noindex` y el
  archivo robots.txt deniega el rastreo; no se declara URL canónica pública.
- No publicar la supuesta discografía de DUCK sin enlaces de distribución y
  créditos reales confirmados.
- No usar el email o las redes del artista Belentani como si fueran canales
  oficiales de contratación de DUCK.
- Para lanzamiento comercial, validar pruebas de audio, accesibilidad,
  propiedad del contenido y URL pública del repositorio canónico.
- Este archivo puede conservarse privado como versión histórica de diseño.

## Criterio de entrega

La variante queda documentada, conservada y diferenciada del sitio principal.
No se presenta como una segunda publicación productiva.
