import { cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import useMultiState from './index'

describe('useMultiState assertions', () => {
  afterEach(cleanup)

  it('returns an array containing a state object', () => {
    const { state } = mockComponent()
    expect(state).not.toBe(undefined)
    expect(state).toStrictEqual({ count: 0, name: 'Olaolu', todos: [] })
  })

  it('returns an array containing a setters object', () => {
    const { setters } = mockComponent()
    expect(setters).not.toBe(undefined)
    expect(setters).toHaveProperty('setCount')
    expect(typeof setters.setCount).toBe('function')
    expect(setters).toHaveProperty('setName')
    expect(typeof setters.setName).toBe('function')
    expect(setters).toHaveProperty('setTodos')
    expect(typeof setters.setName).toBe('function')
    expect(setters).toHaveProperty('addTodo')
    expect(typeof setters.addTodo).toBe('function')
    expect(setters).toHaveProperty('replaceTodo')
    expect(typeof setters.replaceTodo).toBe('function')
    expect(setters).toHaveProperty('removeTodo')
    expect(typeof setters.removeTodo).toBe('function')
  })

  it('contains the right amount of properties in the state object', () => {
    const { state } = mockComponent()
    expect(Object.keys(state)).toHaveLength(3)
  })

  it('contains the right amount of properties in the setters object', () => {
    const { setters } = mockComponent()
    expect(Object.keys(setters)).toHaveLength(6)
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

    fireEvent.change(getByTestId('input'), { target: { value: 'Jude' } }) // uses `setState`
    expect(getByTestId('input').value).toBe('Jude')
    expect(getByTestId('currentName').textContent).toEqual('Jude')

    fireEvent.change(getByTestId('input'), { target: { value: 'Chris' } })
    expect(getByTestId('input').value).toBe('Chris')
    expect(getByTestId('currentName').textContent).toEqual('Chris')
  })

  it('truly inserts todos into the state object', () => {
    const { getByTestId } = mockComponent()

    expect(getByTestId('todos-list').children.length).toEqual(0)

    fireEvent.click(getByTestId('btn-add-todos'))
    expect(getByTestId('todos-list').children.length).toEqual(1)
    expect(getByTestId('todos-list').firstChild.textContent).toEqual(
      'Simple-Todo'
    )

    fireEvent.click(getByTestId('btn-add-todos'))
    expect(getByTestId('todos-list').children.length).toEqual(2)
    expect(getByTestId('todos-list').children.item(1).textContent).toEqual(
      'Simple-Todo'
    )
  })

  it('truly resets todos in the state object', () => {
    const { getByTestId } = mockComponent()

    expect(getByTestId('todos-list').children.length).toEqual(0)

    // First add a todo
    fireEvent.click(getByTestId('btn-add-todos'))
    expect(getByTestId('todos-list').children.length).toEqual(1)
    expect(getByTestId('todos-list').firstChild.textContent).toEqual(
      'Simple-Todo'
    )

    // Reset and it should be an empty list
    fireEvent.click(getByTestId('btn-reset-todos'))
    expect(getByTestId('todos-list').children.length).toEqual(0)
  })

  it('truly replaces todos in the state object', () => {
    const { getByTestId } = mockComponent()

    expect(getByTestId('todos-list').children.length).toEqual(0)

    // First add todos
    fireEvent.click(getByTestId('btn-add-todos'))
    fireEvent.click(getByTestId('btn-add-todos'))
    expect(getByTestId('todos-list').children.length).toEqual(2)
    expect(getByTestId('todos-list').firstChild.textContent).toEqual(
      'Simple-Todo'
    )
    expect(getByTestId('todos-list').children.item(1).textContent).toEqual(
      'Simple-Todo'
    )

    // Replace the first todo
    fireEvent.click(getByTestId('btn-replace-first-todo'))
    expect(getByTestId('todos-list').children.length).toEqual(2)
    expect(getByTestId('todos-list').firstChild.textContent).toEqual(
      'Replaced-Todo'
    )
    expect(getByTestId('todos-list').children.item(1).textContent).toEqual(
      'Simple-Todo'
    )
  })

  it('truly removes todos in the state object', () => {
    const { getByTestId } = mockComponent()

    expect(getByTestId('todos-list').children.length).toEqual(0)

    // First add todos
    fireEvent.click(getByTestId('btn-add-todos'))
    fireEvent.click(getByTestId('btn-add-todos'))
    expect(getByTestId('todos-list').children.length).toEqual(2)
    expect(getByTestId('todos-list').firstChild.textContent).toEqual(
      'Simple-Todo'
    )
    expect(getByTestId('todos-list').children.item(1).textContent).toEqual(
      'Simple-Todo'
    )

    // Remove the first todo
    fireEvent.click(getByTestId('btn-remove-first-todo'))
    expect(getByTestId('todos-list').children.length).toEqual(1)
    expect(getByTestId('todos-list').children.item(0).textContent).toEqual(
      'Simple-Todo'
    )
  })
})

function mockComponent() {
  let payload = {}

  function ReactComponent() {
    const [state, setState, setters] = useMultiState({
      count: 0,
      name: 'Olaolu',
      todos: [],
    })
    const { todos, count, name } = state
    const { setCount, setTodos, addTodo, replaceTodo, removeTodo } = setters

    payload = { state, setState, setters }

    return (
      <div>
        <p data-testid="text">{count}</p>
        <button data-testid="btn" onClick={() => setCount(c => c + 1)}>
          Update count
        </button>

        <p data-testid="currentName">{name}</p>
        <input
          type="text"
          data-testid="input"
          onChange={event => setState({ name: event.target.value })}
        />

        <div>
          <ul data-testid="todos-list">
            {todos.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
          <button
            data-testid="btn-add-todos"
            onClick={() => addTodo('Simple-Todo')}
          >
            Update Todo
          </button>
          <button data-testid="btn-reset-todos" onClick={() => setTodos([])}>
            Reset Todos
          </button>
          <button
            data-testid="btn-replace-first-todo"
            onClick={() => replaceTodo(0, 'Replaced-Todo')}
          >
            Update First Todo
          </button>
          <button
            data-testid="btn-remove-first-todo"
            onClick={() => removeTodo(0)}
          >
            Remove First Todo
          </button>
        </div>
      </div>
    )
  }

  const { getByTestId } = render(<ReactComponent />)

  return Object.assign(payload, {
    getByTestId,
  })
}
