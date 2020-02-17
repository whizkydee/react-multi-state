import React from 'react'
import useMultiState from './index'
import { render, cleanup, fireEvent } from '@testing-library/react'

describe('useMultiState assertions', () => {
  afterEach(cleanup)

  it('returns an array containing a state object', () => {
    const { state } = mockComponent()
    expect(state).not.toBe(undefined)
    expect(state).toStrictEqual({ count: 0, name: 'Olaolu' })
  })

  it('returns an array containing a setters object', () => {
    const { setters } = mockComponent()
    expect(setters).not.toBe(undefined)
    expect(setters).toHaveProperty('setCount')
    expect(typeof setters.setCount).toBe('function')
    expect(setters).toHaveProperty('setName')
    expect(typeof setters.setName).toBe('function')
  })

  it('contains the right amount of properties in the state object', () => {
    const { state } = mockComponent()
    expect(Object.keys(state).length).toBe(2)
  })

  it('contains the right amount of properties in the setters object', () => {
    const { setters } = mockComponent()
    expect(Object.keys(setters).length).toBe(2)
  })

  it('truly updates the values of items in the state object', () => {
    const { getByTestId } = mockComponent()

    fireEvent.click(getByTestId('btn'))
    expect(getByTestId('text').textContent).toEqual('1')

    fireEvent.click(getByTestId('btn'))
    expect(getByTestId('text').textContent).toEqual('2')
  })

  it('truly updates the values of items in the state object via setState', () => {
    const { getByTestId } = mockComponent()

    fireEvent.change(getByTestId('input'), { target: { value: 'Jude' } })
    expect(getByTestId('input').value).toBe('Jude')
    expect(getByTestId('currentName').textContent).toEqual('Jude')
  })
})

function mockComponent() {
  let payload = {}

  function ReactComponent() {
    const [state, setState, setters] = useMultiState({
      count: 0,
      name: 'Olaolu',
    })
    const { count, name } = state
    const { setCount } = setters

    payload = { state, setState, setters }

    return (
      <div>
        <p data-testid="text">{count}</p>
        <button data-testid="btn" onClick={() => setCount(count + 1)}>
          Update count
        </button>

        <p data-testid="currentName">{name}</p>
        <input
          type="text"
          data-testid="input"
          onChange={event => setState({ name: event.target.value })}
        />
      </div>
    )
  }

  const { getByTestId } = render(<ReactComponent />)

  return Object.assign(payload, {
    getByTestId,
  })
}
