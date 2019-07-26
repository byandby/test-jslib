import React, { Component } from 'react'

import ExampleComponent, {testR} from 'test-rl'

console.log(testR([1,2,3,4,5,]))

export default class App extends Component {
  render () {
    return (
      <div>
        <ExampleComponent text='Modern React component module' />
      </div>
    )
  }
}
