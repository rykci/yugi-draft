import React, { useState, useEffect } from 'react'

export default function Draft({ socket, draft, playerIndex, room }) {
  const [bigCard, setBigCard] = useState(
    draft.packs[playerIndex][draft.currentPack][0]
  )
  const [blob, setBlob] = useState(new Blob())

  useEffect(() => {
    if (draft.completed) {
      socket.emit('export deck', { draft, playerIndex })
    }
  }, [draft?.completed])

  useEffect(() => {
    socket.on('deck exported', (data) => {
      console.log(data)
      setBlob(new Blob([data], { type: 'text/plain' }))
    })
  }, [socket])

  return (
    <div className="h-screen overflow-auto">
      <div className="h-max-screen flex h-fit flex-col  justify-around  border-2  border-solid border-indigo-600">
        <div className="w-full text-center font-mono text-xl text-white">
          Pack #{draft.currentPack + 1}
        </div>
        <button onClick={() => console.log(draft)}>CLICk</button>
        <div className=" flex  justify-around ">
          <div className="flex items-center">
            <img src={bigCard?.card_images[0].image_url} />
          </div>

          <div className="grid grid-cols-10 overflow-auto  border-2 border-solid border-indigo-400 bg-slate-300">
            {[...new Array(60)].map((none, i) => (
              <div
                className="border-2 border-solid border-indigo-400 p-1 "
                key={i}
              >
                {i < draft.pools[playerIndex].length ? (
                  <img
                    onMouseOver={() => setBigCard(draft.pools[playerIndex][i])}
                    src={
                      draft.pools[playerIndex][i].card_images[0].image_url_small
                    }
                  />
                ) : (
                  <img src="/blank.png" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex   justify-center">
          {draft.picked[playerIndex] ? (
            <div className="w-full bg-wallpaper text-center font-mono text-xl text-white">
              Waiting for Others...
            </div>
          ) : (
            draft.packs[playerIndex][draft.currentPack].map((card, i) => (
              <div
                className="border-2 border-solid border-indigo-400 bg-slate-300 p-1"
                key={i}
                onMouseOver={() => setBigCard(card)}
                onClick={() => {
                  socket.emit('pick card', {
                    card,
                    playerIndex,
                    draft,
                    roomName: room,
                    cardIndex: i,
                  })
                }}
              >
                <img src={card.card_images[0].image_url_small} />
              </div>
            ))
          )}
        </div>
        <div className="flex  justify-center">
          {draft.completed ? (
            <div className=" rounded-md border-2 border-solid border-cape p-2 font-mono text-white hover:bg-cape">
              <a href={URL.createObjectURL(blob)} download>
                Export Deck
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}
