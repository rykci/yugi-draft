const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: `*`,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

const Draft = require('./Draft')

/*
room = {
name: room name,
users: [,]
gameState: {}
draftInProgress: boolean
}
*/
let Room = []

io.on('connection', (socket) => {
  socket.on('join room', (data) => {
    let roomIndex = Room.findIndex((room) => room.name === data.roomName)
    let list = []

    if (roomIndex >= 0) {
      if (!Room[roomIndex].users.includes(data.id))
        Room[roomIndex].users.push(data.id)
      list = Room[roomIndex].users

      console.log(`${data.id} joined room ${data.roomName}`)
    } else {
      Room.push({
        name: data.roomName,
        users: [data.id],
        gameState: {},
        draftInProgress: false,
      })
      list = [data.id]
      console.log(`${data.id} created room ${data.roomName}`)
    }

    socket.join(data.roomName)
    io.to(data.roomName).emit('userList update', list)
  })

  socket.on('leave room', (data) => {
    let roomIndex = Room.findIndex((room) => room.name === data.roomName)

    Room[roomIndex].users = Room[roomIndex].users.filter((id) => id != data.id)

    console.log(`${data.id} left room ${data.roomName}`)

    socket.leave(data.roomName)
    io.to(data.roomName).emit('userList update', Room[roomIndex].users)
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`)
  })

  socket.on('start draft', (roomName) => {
    roomIndex = Room.findIndex((room) => room.name === roomName)
    Room[roomIndex].gameState = Draft.startDraft(Room[roomIndex].users.length)

    io.to(roomName).emit('draft update', Room[roomIndex].gameState)
  })
})

const PORT = process.env.PORT || 5000

server.listen(process.env.PORT || 5000, () => {
  console.log('listening on ', PORT)
})
