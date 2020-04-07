import { Dispatch, SetStateAction } from 'react'

/**
 * Takes in an object of initial state and returns an array containing
 * three elements – `state`, `setState` and `setters`.
 *
 * `state` is an object that contains the current state of the component.
 *
 * `setState` is a multi-action dispatcher function that takes in a new state object.
 *
 * `setters` is an object that contains composed dispatchAction functions for each state property.
 *
 * @see https://github.com/whizkydee/react-multi-state#-usage
 */
export default function useMultiState<T extends { [key: string]: any }>(
  initialState: T
): [
  T,
  (newState: Partial<T>) => void,
  { [key: string]: Dispatch<SetStateAction<unknown>> }
]
