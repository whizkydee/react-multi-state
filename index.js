import React from 'react'

export default function useMultiState(initialState) {
  const [state, internalDispatchers, setters] = [{}, {}, {}]

  for (const prop in initialState) {
    const value = initialState[prop]
    const [internalValue, dispatchAction] = once(React.useState).call(
      this,
      value
    )

    const capitalizedPropName = capitalize(prop)

    state[prop] = internalValue
    internalDispatchers[prop] = dispatchAction
    setters['set' + capitalizedPropName] = dispatchAction
      
    
    // If the prop is an array, we add helpers to immutably update the array
    if (Array.isArray(value)) {
      setters['add' + removeEndingS(capitalizedPropName)] = (...newItems) => {
        if (newItems.length === 0) return; // If no args are supplied, do nothing
        dispatchAction([...(state[prop]), ...newItems])
      }

      setters['remove' + removeEndingS(capitalizedPropName)] = (indexToRemove) => {
        if (state[prop].length < indexToRemove) return; // If idx isn't in array, do nothing

        dispatchAction([...state[prop].slice(0, indexToRemove), ...state[prop].slice(indexToRemove + 1)]);
      }

      setters['replace' + removeEndingS(capitalizedPropName)] = (index, newItem) => {
        const newState = [...state[prop]];
        newState[index] = newItem;
        dispatchAction(newState);
      }
    }
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

function removeEndingS(str) {
  if (!str.endsWith("s")) return;

  return str.slice(0, str.length - 1);
}
