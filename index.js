import React from 'react'

export default function useMultiState(initialState) {
  const [state, setters, internalDispatchers] = [{}, {}, []]

  for (const prop in initialState) {
    const value = initialState[prop]
    const [internalValue, dispatchAction] = once(React.useState).call(
      this,
      value
    )

    state[prop] = internalValue
    internalDispatchers[prop] = dispatchAction
    setters['set' + capitalize(prop)] = dispatchAction
  }

  return [
    state,
    newState => {
      for (const prop in newState) {
        internalDispatchers[prop](newState[prop])
      }
    },
    setters,
  ]
}

function once(fn) {
  let called = false
  return function(...args) {
    if (called) return
    called = true
    return fn.apply(this, args)
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
