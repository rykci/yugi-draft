import Head from 'next/head'
import { useEffect, useState } from 'react'
import { cubeList } from '../cube'
import cubeObject from '../cubeObject.json'
import { io } from 'socket.io-client'

import LandingPage from '../components/LandingPage'
import Room from '../components/Room'

export default function Home() {
  const [cube, setCube] = useState([])
  const [bigCard, setBigCard] = useState()
  const doFetch = false

  const [room, setRoom] = useState()
  const [socket, setSocket] = useState(null)

  const sortCards = (cards) => {
    return cards.sort((a, b) => {
      if (a.name === b.name) {
        return 1
      }
      if (a.type === b.type) {
        return a.name - b.name
      }
      return a.type >= b.type ? 1 : -1
    })
  }

  useEffect(() => {
    const newSocket = io(`https://yugi-draft.herokuapp.com/`)
    setSocket(newSocket)

    /*
    newSocket.on("room full", (data) => {
      alert(data);
      setRoom();
    });
    */

    return () => newSocket.close()
  }, [setSocket])

  useEffect(() => {
    if (doFetch) {
      fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${cubeList}`)
        .then((response) => response.json())
        .then((data) => setCube(sortCards([...data.data, ...data.data])))
      setBigCard(data.data[0])
    } else {
      const sortedCube = [...sortCards(cubeObject), ...sortCards(cubeObject)]

      setCube(sortedCube)
      setBigCard(sortedCube[0])
    }
  }, [cubeList])

  return (
    <div className="bg-[url('/yugi-wallpaper.png')] bg-cover">
      <div className="flex min-h-screen flex-col items-center justify-center  ">
        <Head>
          <title>Cube Draft</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {room ? (
          <Room socket={socket} room={room} setRoom={setRoom} cube={cube} />
        ) : (
          <LandingPage setRoom={setRoom} />
        )}
      </div>
      <footer className=" absolute bottom-2 w-full items-center justify-center text-center font-mono text-xs text-cape">
        By Ricky Yuen
      </footer>
    </div>
  )
}
