import { sortCards, checkForMatch } from './utils'

const cards = [
  { card: 1 },
  { card: 2 },
  { card: 6 },
  { card: 9 },
  { card: 3 },
  { card: 5 },
  { card: 7 },
  { card: 8 },
]

test('cards to be sorted', () => {
  expect(sortCards(cards)).not.toEqual(cards)
})

const turnedCardsMatch = [{ card: 1 }, { card: 1 }]
const turnedCardsNoMatch = [{ card: 1 }, { card: 2 }]

test('cards to match', () => {
  expect(checkForMatch(turnedCardsMatch).isMatch).toBe(true)
})

test('cards not to match', () => {
  expect(checkForMatch(turnedCardsNoMatch).isMatch).toBe(false)
})
