import React, { Component } from 'react'
import { sortCards, checkForMatch } from './utils'
import data from '../../mock-data/data';
import Timer, { formatTime } from '../Timer/Timer'
import Cards from '../Cards/Cards'
import ToggleLevel from '../ToggleLevel/ToggleLevel'
import './Game.css'

class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cards: null,
      level: '',
      sortedCards: null,
      startGame: false,
      timeGame: false,
      gameOver: false,
      selectedLevel: 'easy',
      easyLevelRecord: null,
      hardLevelRecord: null,
    }
  }

  componentDidMount() {
    const { levels } = data;
    const easy = levels.find(value => value.difficulty === 'easy')
    const hard = levels.find(value => value.difficulty === 'hard')
    this.setState({
      cards: { easy: easy.cards, hard: hard.cards },
      level: 'easy',
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { sortedCards, level, timeGame } = this.state

    if (prevState.sortedCards === sortedCards) {
      return false
    }

    if (timeGame) {
      const sortedDeck = sortedCards[level]
      const matchedCards = sortedDeck.filter(value => value.matched)
      const gameOver = matchedCards.length === sortedDeck.length
      const turnedCards = sortedDeck.filter(value => value.turned && !value.matched)

      if (!gameOver && turnedCards.length === 2) {
        this.updatePair(turnedCards)
      }
      if (gameOver && timeGame) {
        this.endGame()
      }
    }

    return false
  }

  updatePair(turnedCards) {
    const { level } = this.state
    const turnedCardPair = checkForMatch(turnedCards)
    const { isMatch, index1, index2 } = turnedCardPair

    if (isMatch) {
      this.setState(prevState => ({
        sortedCards: {
          ...prevState.sortedCards,
          [level]: Object.assign(
            [...prevState.sortedCards[level]],
            {
              [index1]: {
                ...prevState.sortedCards[level][index1],
                matched: true,
              },
            },
            {
              [index2]: {
                ...prevState.sortedCards[level][index2],
                matched: true,
              },
            }
          ),
        },
      }))
    } else {
      setTimeout(() => {
        this.setState(prevState => ({
          sortedCards: {
            ...prevState.sortedCards,
            [level]: Object.assign(
              [...prevState.sortedCards[level]],
              {
                [index1]: {
                  ...prevState.sortedCards[level][index1],
                  turned: false,
                },
              },
              {
                [index2]: {
                  ...prevState.sortedCards[level][index2],
                  turned: false,
                },
              }
            ),
          },
        }))
      }, 700)
    }

    return false
  }

  endGame() {
    setTimeout(() => {
      this.setState({
        timeGame: false,
        gameOver: true,
        startGame: false,
      })
    }, 500)

    return false
  }

  handleCardClick = (card, isTurned) => {
    const { sortedCards, level, timeGame } = this.state

    if (!timeGame) {
      this.setState({ timeGame: true })
    }

    // find all cards that are turned but haven't already been matched
    const turnedCards = sortedCards[level].filter(value => value.turned && !value.matched)

    if (turnedCards.length < 2) {
      this.turnCardUp(true, card)
    }

    if (turnedCards.length <= 2) {
      if (isTurned) {
        this.turnCardUp(false, card)
      }
    }

    return false
  }

  handleLevelChange = (event) => {
    const isEasy = event.target.checked ? 'easy' : 'hard'
    this.setState({ selectedLevel: isEasy })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { cards, selectedLevel } = this.state
    const storage = window.localStorage
    const easyLevelRecord = storage.getItem('easyRecord')
    const hardLevelRecord = storage.getItem('hardRecord')
    const sorted = sortCards(cards[selectedLevel])

    this.setState(prevState => ({
      sortedCards: {
        ...prevState.sortedCards,
        [selectedLevel]: sorted,
      },
      level: selectedLevel,
      startGame: true,
      gameOver: false,
      easyLevelRecord,
      hardLevelRecord,
    }))
  }

  turnCardUp = (shouldTurnUp, card) => {
    const { level } = this.state
    this.setState(prevState => ({
      sortedCards: {
        ...prevState.sortedCards,
        [level]: Object.assign([...prevState.sortedCards[level]], {
          [card.index]: {
            ...prevState.sortedCards[level][card.index],
            turned: shouldTurnUp,
          },
        }),
      },
    }))

    return false
  }

  renderMessage() {
    const { gameOver, timeGame, level } = this.state

    return (
      <div className='placeholder'>
        {timeGame || gameOver ? (
          <div>
            {gameOver && <span>Final time: </span>}
            <Timer shouldTick={timeGame} level={level} />
          </div>
        ) : (
          <span>Let the games begin</span>
        )}
      </div>
    )
  }

  renderRecord() {
    const { gameOver, timeGame, level, easyLevelRecord, hardLevelRecord } = this.state
    const showEasyRecord = easyLevelRecord && level === 'easy'
    const showHardRecord = hardLevelRecord && level === 'hard'
    const recordTime = showEasyRecord ? easyLevelRecord : hardLevelRecord

    if ((timeGame || gameOver) && (showEasyRecord || showHardRecord)) {
      return <span className='record'>Best Time: {formatTime(recordTime)}</span>
    }

    return false
  }

  render() {
    const { cards, sortedCards, level, selectedLevel, startGame } = this.state

    if (!cards) {
      return <p className="centered">loading</p>
    }

    return (
      <div className="game">
        <header className="header">
          <h1>Memory Card Game</h1>
          {this.renderRecord()}
          {this.renderMessage()}
          {!startGame && (
            <ToggleLevel
              handleChange={this.handleLevelChange}
              handleSubmit={this.handleSubmit}
              selectedLevel={selectedLevel}
            />
          )}
        </header>
        <main className="main">
          {startGame &&
            sortedCards && (
              <Cards cards={sortedCards[level]} handleCardClick={this.handleCardClick} />
            )}
        </main>
      </div>
    )
  }
}

export default Game
