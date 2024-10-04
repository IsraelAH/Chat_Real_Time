import { useState } from 'react'; // Importa el hook useState para gestionar el estado del componente
import './App.css'; // Importa los estilos CSS específicos para este componente
import { io } from 'socket.io-client';  // Importa la función 'io' de socket.io-client para manejar WebSockets
import Chat from './chat'; // Importa el componente 'Chat', que manejará la funcionalidad del chat
import { Card, Icon, Form, Container, Divider, Button } from "semantic-ui-react"; // Importa componentes de Semantic UI para construir la interfaz

// Establece la conexión con el servidor de Socket.IO en "http://localhost:3001"
const socket = io("http://localhost:3001");  

function App() {
  // Estado para el nombre de usuario ingresado
  const [username, setUsername] = useState("");
  
  // Estado para la sala a la que el usuario quiere unirse
  const [room, SetRoom] = useState("");
  
  // Estado para mostrar u ocultar la interfaz de chat
  const [showChat, SetShowChat] = useState(false);

  // Función para unirse a una sala de chat
  const joinRoom = () => {
    // Comprueba si se han proporcionado tanto el nombre de usuario como la sala
    if (username !== "" && room !== "") {
      socket.emit("join_room", room); // Envía el evento 'join_room' al servidor con el ID de la sala
      SetShowChat(true); // Muestra el componente de chat una vez que se ha unido a la sala
    }
  }; 

  return (
    <Container>
      {!showChat ? (  // Si no se ha unido al chat aún, muestra el formulario para unirse
      <Card fluid>
        <Card.Content header="Unirme al chat"/>  {/* Título de la tarjeta */}
        <Card.Content>
          <Form>
            <Form.Field>
              <label>Username</label>  {/* Campo de entrada para el nombre de usuario */}
              <input type="text" placeholder="Usuario:"
                onChange={e => setUsername(e.target.value)}/> {/* Actualiza el estado del username */}
            </Form.Field>
            <Form.Field>
              <label>Sala:</label>  {/* Campo de entrada para el ID de la sala */}
              <input type="text" placeholder="Id Sala:"
              onChange={e => SetRoom(e.target.value)}/>  {/* Actualiza el estado de la sala */}
            </Form.Field>
            <Button onClick={joinRoom}>Unirme</Button>  {/* Botón para unirse a la sala */}
          </Form>
        </Card.Content>
        <Card.Content extra>  {/* Información adicional debajo del formulario */}
          <Icon name="User"/> 4 Friends  {/* Icono con información extra */}
        </Card.Content>
      </Card>
     ) : (  // Si ya está en la sala de chat, muestra el componente 'Chat'
        <Chat socket={socket} username={username} room={room}/>  // Pasa los props al componente Chat
      )}
      
    </Container>
  )
}

export default App;


