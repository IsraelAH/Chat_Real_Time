const express = require("express"); // Importa el framework Express para manejar el servidor web
const app = express(); // Crea una instancia de la aplicación Express
const http = require("http"); // Importa el módulo HTTP para crear un servidor
const cors = require("cors"); // Importa el módulo CORS para permitir peticiones de diferentes dominios
const { Server } = require("socket.io");  // Importa la clase 'Server' de socket.io para manejar WebSockets
const { join } = require("path"); // Importa el método 'join' para manejar rutas (no se usa en este fragmento)

app.use(cors()); // Habilita CORS para que el servidor acepte peticiones desde diferentes dominios

// Crea el servidor HTTP utilizando Express
const server = http.createServer(app);  

// Configura el servidor de WebSockets (Socket.IO) y permite solicitudes desde el cliente en localhost:5173
const io = new Server(server, {         
    cors: {
        origin: "http://localhost:5173", // Permite conexiones desde esta URL
        methods: ["GET", "POST"]         // Solo permite los métodos GET y POST
    }
});

// Escucha el evento de 'connection' que se activa cuando un cliente se conecta
io.on("connection", (socket) => {
    console.log(`Usuario Actual: ${socket.id}`); // Muestra en consola el ID del socket del usuario conectado
    
    // Escucha el evento 'join_room', que indica que un usuario quiere unirse a una sala
    socket.on("join_room", (data) => {
        socket.join(data); // Une al socket (usuario) a la sala indicada en 'data'
        console.log(`Usuario con id: ${socket.id} se unió a la sala ${data}`); // Muestra un mensaje de confirmación
    });

    // Escucha el evento 'send_message', que envía un mensaje a otros usuarios en la sala
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data); // Envía el mensaje a todos en la sala excepto al emisor
    });
    
    // Escucha el evento 'disconnect', que se activa cuando el usuario se desconecta
    socket.on("disconnect", () => {
        console.log("Usuario desconectado: ", socket.id); // Muestra un mensaje en consola indicando la desconexión
    });
});

// El servidor escucha en el puerto 3001 y muestra un mensaje cuando está activo
server.listen(3001, () => {
    console.log("Servidor Activo en el puerto 3001...");
});
