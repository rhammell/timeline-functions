const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const sine = require('periodic-function/sine');
const triangle = require('periodic-function/triangle');
const sawtooth = require('periodic-function/sawtooth');
const square = require('periodic-function/square');
const noise = require('periodic-function/noise');
const pulse = require('periodic-function/pulse');
const clausen = require('periodic-function/clausen');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('User connected.');

  socket.on('subscribe', (channel) => {
    socket.leaveAll();
    socket.join(channel);
  });
});

const N = 100;
const xArr = Array.from({length: N}, (_, i) => i / N);
let i = -1;

server.listen(3000, () => {
  console.log('Listening on *:3000');

  setInterval(() => {
    ++i;
    if (i >= xArr.length) { 
      i = 0;
    }
    
    var x = xArr[i];
    var timestamp = new Date().toISOString();

    io.to('sine').emit('timestamp', {x: x, y: sine(x), timestamp: timestamp});
    io.to('square').emit('timestamp', {x: x, y: square(x), timestamp: timestamp});
    io.to('triangle').emit('timestamp', {x: x, y: triangle(x), timestamp: timestamp});
    io.to('sawtooth').emit('timestamp', {x: x, y: sawtooth(x), timestamp: timestamp});
    io.to('noise').emit('timestamp', {x: x, y: noise(x), timestamp: timestamp});
    io.to('pulse').emit('timestamp', {x: x, y: pulse(x), timestamp: timestamp});
    io.to('clausen').emit('timestamp', {x: x, y: clausen(x), timestamp: timestamp});
  }, 50)

});