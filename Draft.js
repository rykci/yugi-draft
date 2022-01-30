const cube = require('./cubeObject.json')

const shuffleDeck = (deck) => {
  return deck
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

const sortCards = (cards) => {
  return cards.sort((a, b) => {
    if (a.suit === b.suit) {
      return a.value - b.value
    }
    return a.suit > b.suit ? 1 : -1
  })
}

module.exports = {
  cube: shuffleDeck(cube),

  sortCards: sortCards,

  // each player gets [[],[],[],[]] 4 packs of 15 cards
  // ex. 3 players: [[[],[],[],[]], [[],[],[],[]], [[],[],[],[]]]
  startDraft: (numPlayers) => {
    const packs = []
    const pools = []

    const shuffledCube = shuffleDeck(cube)

    for (let i = 0; i < numPlayers; i++) {
      const playerPacks = [
        shuffledCube.slice(i * 60, i * 60 + 15),
        shuffledCube.slice(i * 60 + 15, i * 60 + 30),
        shuffledCube.slice(i * 60 + 30, i * 60 + 45),
        shuffledCube.slice(i * 60 + 45, i * 60 + 60),
      ]
      packs.push(playerPacks)
      pools.push([])
    }
    return { currentPack: 0, packs: packs, pools: pools }
  },
}
