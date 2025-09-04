# Técnicas Clave para la Optimización del Rendimiento Frontend

**Autor:** Mateo Renteria Lujan
**Contexto:** Este documento detalla tres técnicas de alto impacto para mejorar la velocidad de carga y la experiencia de usuario (UX) en aplicaciones web modernas, especialmente en dispositivos móviles. Los ejemplos están basados en React, pero los principios son universales.

---

## 1. División de Código (Code Splitting) y Carga Diferida (Lazy Loading)

### Descripción de la Técnica

En lugar de empaquetar todo el código JavaScript de la aplicación en un único archivo monolítico que el usuario debe descargar al inicio, esta técnica lo divide en "trozos" (chunks) más pequeños y funcionales. Estos trozos se cargan bajo demanda, usualmente a nivel de ruta o componente, a medida que el usuario navega por la aplicación.

- **Code Splitting por Ruta**: Solo se carga el código necesario para la página que el usuario está visitando.
- **Lazy Loading de Componentes**: Componentes pesados o que no son visibles inicialmente (ej. modales, contenido "below the fold") no se cargan hasta que son requeridos.

### Ejemplo Concreto (React)

Se utiliza la función `React.lazy()` para declarar un componente de carga diferida y el componente `<Suspense>` para mostrar una interfaz de respaldo (como un spinner) mientras el chunk de código se descarga.

```jsx
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Los componentes de las páginas se importan de forma diferida (lazy)
const HomePage = React.lazy(() => import("./routes/HomePage"));
const ProfilePage = React.lazy(() => import("./routes/ProfilePage"));

const App = () => (
  <Router>
    {/* Suspense muestra un 'fallback' mientras se carga el código del componente */}
    <Suspense fallback={<div>Cargando página...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Suspense>
  </Router>
);
```
