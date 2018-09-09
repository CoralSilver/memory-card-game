import React from 'react'
import PropTypes from 'prop-types'

export const formatTime = time => {
  if (time < 0) return '--:--'
  const h = Math.floor(time / 3600)
  const m = Math.floor((time % 3600) / 60)
  const mm = m < 10 ? `0${m}` : m
  const s = time % 60
  const ss = s < 10 ? `0${s}` : s
  if (h > 0) return [h, mm, ss].join(':')
  return `${m}:${ss}`
}

const Timer = ({ time = 0 }) => <span aria-label="seconds elapsed">{formatTime(time)}</span>

Timer.propTypes = {
  time: PropTypes.number,
}

class TimerContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      secondsElapsed: 0,
    }
    this.storage = window.localStorage
  }

  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  tick() {
    const { secondsElapsed } = this.state
    const { level } = this.props
    if (!this.props.shouldTick) {
      if (secondsElapsed) {
        const currentRecord = this.storage.getItem(`${level}Record`)
        if (!currentRecord || secondsElapsed < currentRecord) {
          this.storage.setItem(`${level}Record`, secondsElapsed)
        }
      }
      return false
    }

    this.setState({
      secondsElapsed: this.state.secondsElapsed + 1,
    })

    return false
  }

  render() {
    return (
      <Timer
        time={this.state.secondsElapsed}
        tick={this.props.shouldTick}
        level={this.props.level}
      />
    )
  }
}

TimerContainer.propTypes = {
  level: PropTypes.oneOf(['easy', 'hard']),
  shouldTick: PropTypes.bool,
}

TimerContainer.defaultProps = {
  level: 'easy',
  shouldTick: true,
}

export default TimerContainer
