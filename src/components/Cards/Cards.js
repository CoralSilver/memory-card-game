import React from 'react'
import PropTypes from 'prop-types'
import uniqueKey from '../../utils/uniqueKey'
import './Cards.css'

const Cards = ({ cards, handleCardClick }) => (
  <div className="cardsContainer">
    {cards.map((value, index) => {
      const isTurned = value.turned
      const turnedCards = cards.filter(card => card.turned && !card.matched)
      // check that card is not turned or if turned not a match
      const makeDisabled = (turnedCards.length > 1 && !isTurned) || value.matched
      return (
        <div className='buttonContainer' key={uniqueKey()}>
          <button
            className='card'
            aria-label={!isTurned ? `card ${index + 1} face down` : value.card}
            onClick={handleCardClick.bind(null, value, isTurned)} // eslint-disable-line react/jsx-no-bind
            disabled={makeDisabled}
          >
            {isTurned && <span>{value.card}</span>}
          </button>
        </div>
      )
    })}
  </div>
)

Cards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      card: PropTypes.string,
      index: PropTypes.number,
      turned: PropTypes.bool,
      hidden: PropTypes.bool,
    }).isRequired
  ),
  handleCardClick: PropTypes.func.isRequired,
}

export default Cards
