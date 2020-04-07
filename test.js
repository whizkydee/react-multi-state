import React from 'react'
import useMultiState from './index'
import { render, cleanup, fireEvent } from '@testing-library/react'

describe('useMultiState assertions', () => {
  afterEach(cleanup)

  it('returns an array containing a state object', () => {
    const { state } = mockComponent()
    expect(state).not.toBe(undefined)
    expect(state).toStrictEqual({ age: 10, count: 0, name: 'Olaolu' })
  })

  it('returns an array containing a setters object', () => {
    const { setters } = mockComponent()

    expect(setters).not.toBe(undefined)
    expect(setters).toHaveProperty('setCount')
    expect(typeof setters.setCount).toBe('function')
    expect(setters).toHaveProperty('setName')
    expect(typeof setters.setName).toBe('function')
    expect(setters).toHaveProperty('setAge')
    expect(typeof setters.setAge).toBe('function')
  })

  it('contains the right amount of properties in the state object', () => {
    const { state } = mockComponent()
    expect(Object.keys(state)).toHaveLength(3)
  })

  it('contains the right amount of properties in the setters object', () => {
    const { setters } = mockComponent()
    expect(Object.keys(setters)).toHaveLength(3)
  })

  it('truly updates the values of items in the state object', () => {
    const { getByTestId } = mockComponent()

    fireEvent.click(getByTestId('count-btn'))
    expect(getByTestId('count-text').textContent).toEqual('1')

    fireEvent.click(getByTestId('count-btn'))
    expect(getByTestId('count-text').textContent).toEqual('2')
  })

  it('truly updates the values of items in the state object via setState', () => {
    const { getByTestId } = mockComponent()

    fireEvent.change(getByTestId('input'), { target: { value: 'Jude' } }) // uses `setState`
    expect(getByTestId('input').value).toBe('Jude')
    expect(getByTestId('currentName').textContent).toEqual('Jude')

    fireEvent.change(getByTestId('input'), { target: { value: 'Chris' } })
    expect(getByTestId('input').value).toBe('Chris')
    expect(getByTestId('currentName').textContent).toEqual('Chris')
  })

  it('updates state with the correct value via a prevState parameter passed to setState', () => {
    const { getByTestId } = mockComponent()

    fireEvent.click(getByTestId('age-btn'))
    expect(getByTestId('age-text').textContent).toEqual('20') // uses `setState`

    fireEvent.click(getByTestId('age-btn'))
    expect(getByTestId('age-text').textContent).toEqual('30') // uses `setState`
  })
})

function mockComponent() {
  let payload = {}

  function ReactComponent() {
    const [state, setState, setters] = useMultiState({
      age: 10,
      count: 0,
      name: 'Olaolu',
    })
    const { age, count, name } = state
    const { setCount } = setters

    payload = { state, setState, setters }

    return (
      <div>
        <p data-testid="count-text">{count}</p>
        <button data-testid="count-btn" onClick={() => setCount(c => c + 1)}>
          Update count
        </button>

        <p data-testid="currentName">{name}</p>
        <input
          type="text"
          data-testid="input"
          onChange={event => setState({ name: event.target.value })}
        />

        <p data-testid="age-text">{age}</p>
        <button
          data-testid="age-btn"
          onClick={() => {
            setState(prevState => ({
              age: prevState.age + 10,
            }))
          }}
        >
          Update age
        </button>
      </div>
    )
  }

  const { getByTestId } = render(<ReactComponent />)

  return Object.assign(payload, {
    getByTestId,
  })
}
