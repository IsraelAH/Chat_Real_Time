import { StrictMode } from 'react'; // Importa StrictMode de React para detectar problemas potenciales en la aplicación
import { createRoot } from 'react-dom/client'; // Importa createRoot de ReactDOM para crear el nodo raíz del DOM donde se montará la aplicación
import App from './App.jsx'; // Importa el componente principal 'App' desde el archivo 'App.jsx'
import './index.css'; // Importa el archivo CSS para aplicar estilos globales
import "semantic-ui-css/semantic.min.css"; // Importa los estilos de Semantic UI para aplicar su diseño CSS

// Crea un nodo raíz en el DOM, usando el elemento con el id 'root', y renderiza la aplicación dentro del StrictMode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> {/* Monta el componente 'App' dentro de StrictMode */}
  </StrictMode>,
);
