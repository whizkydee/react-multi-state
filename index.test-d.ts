import useMultiState from '.'
import { expectType, expectError } from 'tsd'
import React, { Dispatch, SetStateAction } from 'react'

export function TestComponent() {
  const [state, setState, setters] = useMultiState({
    age: 25,
    name: 'Chris',
    interests: ['Biking', 'Skydiving'],
  })

  expectType<number>(state.age)
  expectType<string>(state.name)
  expectType<string[]>(state.interests)

  React.useEffect(() => {
    expectError(setState({ age: '20' }))
    expectType<void>(setState({ age: 20 }))

    // Test that the value of the `prevState` parameter in `setState`
    // has the same signature as that of `state`.
    setState(prevState => {
      expectType<{
        age: number
        name: string
        interests: string[]
      }>(prevState)
      return {
        age: prevState.age + 2,
      }
    })

    expectType<void>(setters.setName('Olaolu'))

    expectType<Dispatch<SetStateAction<number>>>(setters.setAge)
    expectType<Dispatch<SetStateAction<string>>>(setters.setName)
    expectType<Dispatch<SetStateAction<string[]>>>(setters.setInterests)
  }, [setState, setters])
}
