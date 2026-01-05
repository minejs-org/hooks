<!-- ╔══════════════════════════════ BEG ══════════════════════════════╗ -->

<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="logo" style="" height="60" />
    </p>
</div>

<div align="center">
    <img src="https://img.shields.io/badge/v-0.0.5-black"/>
    <img src="https://img.shields.io/badge/🔥-@minejs-black"/>
    <br>
    <img src="https://img.shields.io/badge/coverage-98.94%25-brightgreen" alt="Test Coverage" />
    <img src="https://img.shields.io/github/issues/minejs-org/hooks?style=flat" alt="Github Repo Issues" />
    <img src="https://img.shields.io/github/stars/minejs-org/hooks?style=social" alt="GitHub Repo stars" />
</div>
<br>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ DOC ══════════════════════════════╗ -->

- ## Quick Start 🔥

    > **_React-inspired hooks for reactive state management._**

    - ### Setup

        > install [`hmm`](https://github.com/minejs-org/hmm) first.

        ```bash
        hmm i @minejs/hooks
        ```

    <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

    - ### Usage

        ```ts
        import { useState, useEffect, useSignal } from '@minejs/hooks'
        ```

        - ### 1. useState - Stateful Values

            ```typescript
            // Setup hook context in your component
            const context = {
                hooks: [],
                currentHookIndex: 0,
                component: {}
            }
            setHookContext(context)

            // Create state
            const [count, setCount] = useState(0)

            // Read value
            console.log(count()) // 0

            // Update value
            setCount(5)
            console.log(count()) // 5

            // Update with function
            setCount(prev => prev + 1)
            console.log(count()) // 6
            ```

        - ### 2. useEffect - Side Effects

            ```typescript
            const [name, setName] = useState('John')

            // Effect runs when dependencies change
            useEffect(() => {
                console.log('Hello,', name())

                // Optional cleanup
                return () => {
                    console.log('Cleaning up...')
                }
            }, [name])
            ```

        - ### 3. useMemo - Memoized Values

            ```typescript
            const items = signal([1, 2, 3])

            // Memoized computation
            const total = useMemo(() => {
                return items().reduce((a, b) => a + b, 0)
            }, [items()])

            console.log(total()) // 6
            ```

        - ### 4. useRef - Persistent References

            ```typescript
            const count = useRef(0)

            count.current = 5
            console.log(count.current) // 5 (persists across renders)
            ```


    <br>

- ## API Reference 🔥

    - #### `useState<T>(initialValue: T): [Signal<T>, (action: SetStateAction<T>) => void]`
        > Create reactive state with update function.

        ```typescript
        const [count, setCount] = useState(0)

        count()              // Read: 0
        setCount(5)          // Write: 5
        setCount(n => n + 1) // Update: 6
        ```

    - #### `useEffect(callback: () => void | (() => void), deps?: DependencyList): void`

        > Run side effects when dependencies change.

        ```typescript
        useEffect(() => {
            console.log('Effect ran!')

            // Optional cleanup
            return () => {
                console.log('Cleanup!')
            }
        }, [dependency])
        ```

    - #### `useMemo<T>(factory: () => T, deps: DependencyList): T`

        > Memoize expensive computations.

        ```typescript
        const expensiveValue = useMemo(() => {
            return complexCalculation(data)
        }, [data])
        ```

    - #### `useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T`

        > Memoize function references.

        ```typescript
        const handleClick = useCallback(() => {
            setCount(prev => prev + 1)
        }, [])
        ```

    - #### `useRef<T>(initialValue: T): { current: T }`

        > Create persistent reference that survives renders.

        ```typescript
        const inputRef = useRef<HTMLInputElement>(null)
        inputRef.current?.focus()
        ```

    - #### `useReducer<S, A>(reducer: Reducer<S, A>, initialState: S): [Signal<S>, (action: A) => void]`

        > Complex state management with reducer pattern.

        ```typescript
        type Action = { type: 'INC' } | { type: 'DEC' }
        const [state, dispatch] = useReducer(reducer, 0)
        dispatch({ type: 'INC' })
        ```

    - #### `useContext<T>(context: Context<T>): T`

        > Access context values.

        ```typescript
        const theme = useContext(ThemeContext)
        ```

    - #### `useSignal<T>(initialValue: T): Signal<T>`

        > Create native signal (CruxJS integration).

        ```typescript
        const sig = useSignal(0)
        sig.set(5)
        sig.update(n => n + 1)
        ```

    - #### `useComputed<T>(fn: () => T): Signal<T>`

        > Create derived signal from other signals.

        ```typescript
        const doubled = useComputed(() => count() * 2)
        ```

    - #### `useToggle(initialValue?: boolean): [Signal<boolean>, () => void]`

        > Toggle boolean state.

        ```typescript
        const [isOpen, toggle] = useToggle(false)
        toggle() // true
        toggle() // false
        ```

    - #### `useCounter(initialValue?: number): { count: Signal<number>, increment: () => void, decrement: () => void, reset: () => void }`

        > Counter with increment/decrement/reset.

        ```typescript
        const counter = useCounter(0)
        counter.increment()
        counter.decrement()
        counter.reset()
        ```

    - #### `useLocalStorage<T>(key: string, initialValue: T): [Signal<T>, (value: T) => void]`

        > Persist state to localStorage.

        ```typescript
        const [saved, setSaved] = useLocalStorage('user', {})
        ```

    - #### `useDebounce<T>(value: T, delay: number): T`

        > Debounce value changes.

        ```typescript
        const debouncedSearch = useDebounce(searchInput, 300)
        ```

    - #### `useInterval(callback: () => void, delay: number | null): void`

        > Run callback at interval.

        ```typescript
        useInterval(() => {
            console.log('Every second!')
        }, 1000)
        ```

    - #### `useWindowSize(): { width: number, height: number }`

        > Get current window dimensions.

        ```typescript
        const size = useWindowSize()
        console.log(size.width, size.height)
        ```

    - #### `useMediaQuery(query: string): boolean`

        > Check media query matches.

        ```typescript
        const isMobile = useMediaQuery('(max-width: 768px)')
        ```

    - #### `useEventListener<K extends keyof WindowEventMap>(eventName: K, handler: (event: WindowEventMap[K]) => void, element?: Window | HTMLElement): void`

        > Attach event listeners.

        ```typescript
        useEventListener('click', (e) => {
            console.log('Clicked!')
        })
        ```

    <br>


- ## Real-World Examples

  - #### Counter Component

    ```typescript
    import { useState, setHookContext } from '@minejs/hooks'

    function Counter() {
      const context = { hooks: [], currentHookIndex: 0, component: {} }
      setHookContext(context)

      const [count, setCount] = useState(0)

      const button = document.createElement('button')
      button.textContent = `Count: ${count()}`

      button.onclick = () => setCount(prev => prev + 1)

      return button
    }
    ```

  - #### Todo App

    ```typescript
    import { useState, useEffect, useMemo } from '@minejs/hooks'

    interface Todo {
      id: number
      text: string
      done: boolean
    }

    const [todos, setTodos] = useState<Todo[]>([])
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

    const filteredTodos = useMemo(() => {
      const f = filter()
      const t = todos()

      if (f === 'active') return t.filter(todo => !todo.done)
      if (f === 'completed') return t.filter(todo => todo.done)
      return t
    }, [filter(), todos()])

    // Actions
    function addTodo(text: string) {
      setTodos(list => [
        ...list,
        { id: Date.now(), text, done: false }
      ])
    }

    function toggleTodo(id: number) {
      setTodos(list =>
        list.map(todo =>
          todo.id === id ? { ...todo, done: !todo.done } : todo
        )
      )
    }
    ```

  - #### Form with Validation

    ```typescript
    import { useState, useMemo, useEffect } from '@minejs/hooks'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const isEmailValid = useMemo(() => {
      return email().includes('@') && email().length > 3
    }, [email()])

    const isPasswordValid = useMemo(() => {
      return password().length >= 8
    }, [password()])

    const canSubmit = useMemo(() => {
      return isEmailValid() && isPasswordValid()
    }, [isEmailValid(), isPasswordValid()])

    useEffect(() => {
      const button = document.querySelector('#submit') as HTMLButtonElement
      if (button) button.disabled = !canSubmit()
    }, [canSubmit()])
    ```

  - #### Debounced Search

    ```typescript
    import { useState, useEffect, useDebounce } from '@minejs/hooks'

    const [searchTerm, setSearchTerm] = useState('')
    const debouncedTerm = useDebounce(searchTerm, 300)

    useEffect(() => {
      if (!debouncedTerm) return

      // Fetch search results
      fetch(`/api/search?q=${debouncedTerm}`)
        .then(r => r.json())
        .then(results => setResults(results))
    }, [debouncedTerm])
    ```


<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ END ══════════════════════════════╗ -->

<br>

---

<div align="center">
    <a href="https://github.com/maysara-elshewehy"><img src="https://img.shields.io/badge/by-Maysara-black"/></a>
</div>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->