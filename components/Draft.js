import React, { useState } from 'react'

export default function Draft({ socket, draft, playerIndex }) {
  const [bigCard, setBigCard] = useState(draft.packs[playerIndex][0][0])

  return (
    <div className=" flex max-h-screen  justify-around border-2 border-solid  border-indigo-600 pb-0 ">
      <div className="flex items-center">
        <img src={bigCard?.card_images[0].image_url} />
      </div>

      <div className=" overflow-auto">
        <div className="grid grid-cols-5 border-2 border-solid border-indigo-400 bg-slate-300">
          {draft.packs[playerIndex][0].map((card, i) => (
            <div
              className="border-2 border-solid border-indigo-400 p-1"
              key={i}
              onMouseOver={() => setBigCard(card)}
            >
              <img src={card.card_images[0].image_url_small} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
