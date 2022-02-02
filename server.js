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
    let roomIndex = Room.findIndex((room) => room.users.includes(socket.id))

    if (roomIndex >= 0) {
      console.log(`${socket.id} left room ${Room[roomIndex].name}`)
      Room[roomIndex].users = Room[roomIndex].users.filter(
        (id) => id != socket.id
      )
    }

    console.log(`${socket.id} disconnected`)
  })

  socket.on('start draft', (roomName) => {
    roomIndex = Room.findIndex((room) => room.name === roomName)
    Room[roomIndex].gameState = Draft.startDraft(Room[roomIndex].users.length)

    io.to(roomName).emit('draft update', Room[roomIndex].gameState)
  })

  socket.on(
    'pick card',
    ({ card, playerIndex, draft, roomName, cardIndex }) => {
      draft.pools[playerIndex].push(card)

      draft.packs[playerIndex][draft.currentPack].splice(cardIndex, 1)

      draft.picked[playerIndex] = true

      const checker = draft.picked.includes(false)
      if (!checker) {
        //check if packs are finished
        if (draft.packs[playerIndex][draft.currentPack].length == 0) {
          if (draft.currentPack == draft.lastPack) {
            console.log('draft done')
            draft.completed = true
          } else {
            draft.currentPack++
            console.log('next pack')
          }
        } else {
          //pass packs around
          if (draft.currentPack % 2 == 0) {
            //clockwise
            const endPack = draft.packs.pop()
            draft.packs.unshift(endPack)
          } else {
            const endPack = draft.packs.shift()
            draft.packs.push(endPack)
          }
        }
        draft.picked.fill(false)
      }

      io.to(roomName).emit('draft update', draft)
    }
  )

  socket.on('export deck', ({ draft, playerIndex }) => {
    const ydk = draft.pools[playerIndex].map((card) => card.id)
    ydk.unshift('#main')
    ydk.unshift('#created by ...')
    ydk.push('#extra')
    ydk.push('63519819')
    ydk.push('63519819')
    ydk.push('!side')

    require('fs').writeFile(
      './public/draft.ydk',
      ydk.join('\n') + '\n',
      (err) => {
        if (err) {
          console.error('Crap happens')
        }
      }
    )

    socket.emit('deck exported', ydk.join('\n') + '\n')
  })
})

const PORT = process.env.PORT || 5000

server.listen(process.env.PORT || 5000, () => {
  console.log('listening on ', PORT)
})
