import React, { useState } from 'react'

export default function LandingPage({ setRoom }) {
  const [value, setValue] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setRoom(value)
      }}
      className="flex flex-col  justify-center gap-y-5 align-middle "
    >
      <label className="text-center font-mono text-2xl text-white">
        Enter Room Name
      </label>

      <input
        className=" rounded-md border-4 border-cape p-2 font-mono focus:outline-none"
        autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="border-1 rounded-md border border-solid border-[#1c1836] bg-cape p-2 font-mono text-white shadow-lg hover:bg-[#1c1836] "
        onClick={(e) => {
          e.preventDefault()
          setRoom(value)
        }}
      >
        Enter Room
      </button>
    </form>
  )
}
