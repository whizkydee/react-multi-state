## react-multi-state

🦍Declarative, simplified way to handle complex local state with hooks.

<!-- useState, but simplified for complex local states in React apps. -->

## ✨ Features

- 📦 ~286b (gzipped)
- 🔥 Easy to scale
- 🙅‍♂️ Zero dependencies
- ✂️ Super-flexible API
- ✅ Fully tested and reliable
- 🌈 More declarative than `React.useState`
- ⚒ CommonJS, ESM & browser standalone support

## 🔧 Installation

You can easily install this package with yarn or npm:

```
$ yarn add react-multi-state
```

or

```
$ npm install --save react-multi-state
```

## 📖 Usage

The function takes in an object of initial state and returns an array containing
three elements – `state`, `setState` and `setters`:

- _state_, which contains the current state of the component.
- _setState_, which is a multi-action dispatcher that takes in a new state
  object.
- _setters_, which contains composed `dispatchAction` functions for each state
  property.

Here is a simple example:

```jsx
import React, { useEffect } from 'react'
import useMultiState from 'react-multi-state'

export default function Users() {
  const [state, setState, { setCleanupAfter }] = useMultiState({
    users: [],
    isFetched: false,
    cleanupAfter: false,
  })

  useEffect(() => {
    ;(async function() {
      const usersData = await getUsers()
      setState({ isFetched: true, users: usersData })
      setCleanupAfter(true)
    })()
  }, [])

  return (
    <ul>
      {state.users.map(({ name }) => (
        <li class="user">{name}</li>
      ))}
    </ul>
  )
}
```

## 👀 Comparison with `React.useState` (examples)

With `React.useState`, you'd have to call `useState` and the individual
dispatcher functions multiple times which is hard to scale and can get messy
real quick as the complexity of your component increases. For example:

```jsx
import React, { useState, useEffect } from 'react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [userName, setUserName] = useState('')
  const [gender, setGender] = useState('M')
  const [isFetched, setIsFetched] = useState(false)

  useEffect(() => {
    ;(async function() {
      const usersData = await getUsers()
      setUsers(usersData)
      setIsFetched(true)
    })()
  }, [])
}
```

Meanwhile, with `useMultiState`, all you need is a state object, and you can
update as many properties as you want at once like:

```jsx
import { Fragment } from 'react'

function Form() {
  const [{ firstName, lastName }, setState, setters] = useMultiState({
    firstName: '',
    lastName: '',
  })

  console.log(setState, setters)
  //=> { setState: 𝑓 }, { setFirstName: 𝑓, setLastName: 𝑓 }

  return (
    <Fragment>
      <form
        onSubmit={event => {
          const { elements } = event.target
          setState({
            firstName: elements.firstName,
            lastName: elements.lastName,
          })
        }}
      >
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
        <button type="submit">Submit</button>
      </form>

      <h2>
        My full name is {firstName} {lastName}
      </h2>
    </Fragment>
  )
}
```

## 💡 More examples

If you prefer dedicated dispatcher functions instead, `useMultiState` supports
that too. Each time you add a property to the state object, a new setter based
on the property name is composed and attached to the `setters` object. So if you
like to destructure, you can easily create variables for your state and setters
without worrying about defining them in any particular order, contrary to
`React.useState`. For instance:

```jsx
function Title() {
  const [{ title, lesson }, , { setTitle, setLesson }] = useMultiState({
    title: 'Unicorns',
    lesson: {},
    assignments: null,
    archives: [],
    showModal: false,
  })

  const updateTitle = title => setTitle('Title: ' + title)
  console.log(title, setLesson)
  //=> "Unicorns", 𝑓 setLesson()

  return <h1>{title}</h1>
}
```

**Notice how the second element (`setState`) is omitted in the above example.**

Better still, you can consume the properties directly from the state and setters
object, like so:

```jsx
function Title() {
  const [state, , setters] = useMultiState({
    title: '',
    lesson: {},
    assignments: null,
    archives: [],
    showModal: false,
  })

  const updateTitle = title => setters.setTitle('Title: ' + title)
  console.log(state, setters)
  //=> { title, ... }, { setTitle: 𝑓, ... }

  return <h1>{state.title}</h1>
}
```

Or... destructure some properties and accumulate the rest into _state_ and
_setters_ objects:

```jsx
function Title() {
  const [
    { title, lesson, ...state },
    setState,
    { setTitle, ...setters },
  ] = useMultiState({
    title: '',
    lesson: {},
    assignments: null,
    archives: [],
    showModal: false,
  })
  console.log(state, setters)
  //=> { assignments, ... }, { setAssignments: 𝑓, ... }

  return <h1>{title}</h1>
}
```

✨

## 🤝 License

MIT © [Olaolu Olawuyi](https://twitter.com/mrolaolu)
