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

    // TypeScript doesn't have an API that allows us dynamically augment property names.
    // See https://github.com/microsoft/TypeScript/issues/12754
    //
    // So, as a half-baked workaround to assert the type of each function in `setters`,
    // we check the type of the value we pass to each dispatcher function and then assert
    // that it contains at least one of the property value types specified in the local
    // `state` object signature...
    expectType<Dispatch<SetStateAction<string | number | string[]>>>(
      setters.setName
    )
    // ...This is why we expect an error in the next LOC -- because going by our local
    // `state` signature, none of the property values is an object. Pretty clever, eh?
    expectError(setters.setAge({ a: 1 }))
  }, [setState, setters])
}
