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

const NUM_PACKS = 5
const NUM_CARDS = 11

module.exports = {
  cube: shuffleDeck(cube),

  sortCards: sortCards,

  // each player gets [[],[],[],[]] 4 packs of 15 cards
  // ex. 3 players: [[[],[],[],[]], [[],[],[],[]], [[],[],[],[]]]
  startDraft: (numPlayers) => {
    const packs = []
    const pools = []
    const picked = []

    const shuffledCube = shuffleDeck(cube)

    for (let i = 0; i < numPlayers; i++) {
      packs.push([])
      for (let j = 0; j < NUM_PACKS; j++) {
        packs[i].push(
          shuffledCube.slice(
            j * NUM_CARDS + i * (NUM_CARDS * NUM_PACKS),
            (j + 1) * NUM_CARDS + i * (NUM_CARDS * NUM_PACKS)
          )
        )
      }
      pools.push([])
      picked.push(false)
    }
    return {
      currentPack: 0,
      packs: packs,
      pools: pools,
      picked,
      lastPack: NUM_PACKS - 1,
      completed: false,
    }
  },
}
