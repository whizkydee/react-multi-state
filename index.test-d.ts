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

    expectType<void>(setters.setName('Olaolu'))

    // TypeScript doesn't have an API that allows us dynamically augment property names
    // which is quite unfortunate because we rely on that feature to provide an optimal
    // TypeScript DX.
    // See https://github.com/microsoft/TypeScript/issues/12754

    // We expect `unknown` here becuase of https://github.com/whizkydee/react-multi-state/issues/7
    expectType<Dispatch<SetStateAction<unknown>>>(setters.setName)
  }, [setState, setters])
}
