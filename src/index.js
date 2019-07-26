import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import styles from './styles.css'

export const testR = R.join('||')

export default class ExampleComponent extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  render() {
    const {
      text
    } = this.props

    return (
      <div className={styles.test}>
        Example Component: {text}
      </div>
    )
  }
}
