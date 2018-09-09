import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './ToggleLevel.css'

const ToggleLevel = ({ handleChange, handleSubmit, selectedLevel }) => {
  const isEasyLevel = selectedLevel === 'easy'
  return (
    <form onSubmit={handleSubmit} className='toggleForm'>
      <legend>Select level:</legend>
      <label className="toggle-label" htmlFor="level">
        <input id="level" type="checkbox" checked={isEasyLevel} onChange={handleChange} />
        <span className="group">
          <span className="toggle" />
          <span
            className={classnames("label", "on")}
            value="easy"
            aria-selected={isEasyLevel}
          >
            Easy
          </span>
          <span
            className={classnames("label", "off")}
            value="hard"
            aria-selected={!isEasyLevel}
          >
            Hard
          </span>
        </span>
      </label>
      <button type="submit" className="play">
        Play
      </button>
    </form>
  )
}

ToggleLevel.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  selectedLevel: PropTypes.oneOf(['easy', 'hard']),
}

ToggleLevel.defaultProps = {
  selectedLevel: 'easy',
}

export default ToggleLevel
