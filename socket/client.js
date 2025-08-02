const socket = io("http://localhost:3001");

socket.on('message', (data) => {
  console.log('RECEIVED MESSAGE:', data);
});