import React from 'react'
import cube from '../public/cubeObject.json'

export default function list() {
  return (
    <div className="flex min-h-screen justify-center bg-wallpaper">
      <div className="grid grid-cols-10">
        {cube.map((card) => (
          <img src={card.card_images[0]?.image_url_small} />
        ))}
      </div>
    </div>
  )
}
