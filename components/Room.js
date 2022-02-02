import React, { useState, useEffect } from 'react'
import Draft from './Draft'

export default function Room({ socket, room, setRoom, cube }) {
  const [userList, setUserList] = useState([socket.id])
  const [draft, setDraft] = useState()
  const [playerIndex, setPlayerIndex] = useState(0)

  useEffect(() => {
    socket.emit('join room', { id: socket.id, roomName: room })

    socket.on('userList update', (list) => {
      setPlayerIndex(list.findIndex((id) => id == socket.id))
      setUserList(list)
    })

    socket.on('draft update', (data) => {
      setDraft(data)
    })

    socket.on('deck exported', (data) => console.log(data))
  }, [socket])

  return (
    <div className="flex min-h-screen min-w-full flex-col justify-center bg-wallpaper">
      {/*
      
            */}

      {draft ? (
        <Draft
          socket={socket}
          draft={draft}
          playerIndex={playerIndex}
          room={room}
        />
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div className="font-serif text-5xl text-white">LOBBY</div>
          <ul className="list-disc font-mono text-2xl text-white">
            {userList.map((id) => (
              <li key={id}>{id == socket.id ? `${id} (you)` : id}</li>
            ))}
          </ul>
          {userList[0] == socket.id ? (
            <div>
              <button
                onClick={() => socket.emit('start draft', room)}
                className="rounded-md border-2 border-solid p-2 font-mono text-sm text-white hover:bg-cape"
              >
                Start Draft
              </button>
            </div>
          ) : (
            <div className="font-mono text-sm text-white">
              Waiting for Host to Start...
            </div>
          )}
          <button
            onClick={() => {
              setRoom('')
              socket.emit('leave room', { id: socket.id, roomName: room })
            }}
            className="rounded-md border-2 border-solid p-2 font-mono text-sm text-white hover:bg-cape"
          >
            Leave Room
          </button>{' '}
        </div>
      )}
    </div>
  )
}
