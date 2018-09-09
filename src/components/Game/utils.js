const sortCards = cards => {
  // use spead operator on cards so orginal array isn't mutated
  const sortedCardsArr = [...cards].sort(() => 0.5 - Math.random())
  const sortedCards = sortedCardsArr.map((value, index) => ({
    card: value,
    index,
    turned: false,
    matched: false,
  }))

  return sortedCards
}

const checkForMatch = turnedCards => {
  const isMatch = turnedCards[0].card === turnedCards[1].card
  const index1 = turnedCards[0].index
  const index2 = turnedCards[1].index

  return { isMatch, index1, index2 }
}

export { sortCards, checkForMatch }
