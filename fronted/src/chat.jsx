import React, { useEffect, useState } from "react"; // Importa React, useEffect para manejar efectos secundarios y useState para el estado local
import { Card, Icon, Form, Container, Divider, Button, Input, List, Item, Message } from "semantic-ui-react"; // Importa componentes de Semantic UI para construir la UI
import ScrollToBottom from 'react-scroll-to-bottom'; // Componente que permite hacer scroll automático al final del contenedor

const Chat = ({ socket, username, room }) => { // Desestructura las props pasadas: socket, username y room
    const [currentMessage, setCurrentMessage] = useState(""); // Estado para almacenar el mensaje actual
    const [messageList, setMessageList] = useState([]); // Estado para almacenar la lista de mensajes enviados y recibidos

    // Función para enviar mensajes
    const sendMessages = async () => {
        if (username && currentMessage) { // Solo envía el mensaje si el username y el mensaje actual están definidos
            const info = { // Objeto que contiene la información del mensaje
                message: currentMessage,
                room, // Sala a la que pertenece el mensaje
                author: username, // Nombre del usuario que envía el mensaje
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(), // Hora del mensaje
            };
            await socket.emit("send_message", info); // Envía el mensaje al servidor mediante el evento 'send_message'
            setMessageList((list) => [...list, info]); // Añade el mensaje enviado a la lista de mensajes
            setCurrentMessage(""); // Limpia el campo del mensaje actual
        }
    };

    // Efecto para escuchar los mensajes entrantes desde el servidor
    useEffect(() => {
        const MessageHandle = (data) => { // Función que maneja los mensajes recibidos
            setMessageList((list) => [...list, data]); // Añade el mensaje recibido a la lista de mensajes
        };

        socket.on("receive_message", MessageHandle); // Escucha el evento 'receive_message' desde el servidor

        return () => socket.off("receive_message", MessageHandle); // Limpia el evento al desmontar el componente
    }, [socket]); // El efecto depende del socket

    return (
        <Container>
            <Card fluid>
                <Card.Content header={`Chat en vivo | sala: ${room}`} /> {/* Título del chat con el nombre de la sala */}
                <ScrollToBottom>
                    <Card.Content style={{ minHeight: "300px", padding: "5px" }}> {/* Contenedor de los mensajes */}
                        {messageList.map((item, i) => { // Mapea la lista de mensajes para mostrarlos
                            return (
                                <span key={i}>
                                    <Message
                                        style={{ textAlign: username === item.author ? 'right' : 'left' }} // Alinea el mensaje según el autor
                                        success={username === item.author} // Cambia el estilo si el usuario es el autor
                                        info={username !== item.author} // Estilo informativo si es de otro usuario
                                    >
                                        <Message.Header>{item.message}</Message.Header> {/* Muestra el mensaje */}
                                        <p> Enviado por: <strong>{item.author}</strong>, a las: <i>{item.time}</i></p> {/* Muestra el autor y la hora */}
                                    </Message>
                                    <Divider /> {/* Separador entre mensajes */}
                                </span>
                            );
                        })}
                    </Card.Content>
                </ScrollToBottom>
                <Card.Content extra>
                    <Form>
                        <Form.Field>
                            <div className="ui action input">
                                {/* Campo de entrada de texto para el mensaje */}
                                <input 
                                    value={currentMessage} 
                                    type="text" 
                                    placeholder="Mensaje..."
                                    onChange={e => setCurrentMessage(e.target.value)} // Actualiza el estado del mensaje actual
                                    onKeyPress={(e) => { // Envía el mensaje si se presiona la tecla Enter
                                        if (e.key === "Enter") sendMessages();
                                    }} 
                                />
                                {/* Botón para enviar el mensaje */}
                                <Button 
                                    type="button" 
                                    className="ui teal icon right labeled Button" 
                                    onClick={sendMessages} // Envía el mensaje al hacer clic
                                >
                                    <Icon name="send" /> {/* Ícono de enviar */}
                                    Enviar
                                </Button>
                            </div>
                        </Form.Field>
                    </Form>
                </Card.Content>
            </Card>
        </Container>
    );
};

export default Chat; // Exporta el componente para ser usado en otros archivos
