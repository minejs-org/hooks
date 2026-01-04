/* eslint-disable @typescript-eslint/no-explicit-any */
// src/main.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import { signal, computed, type Signal } from '@minejs/signals';
    import type * as types from './types';
    export type * from './types';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    let currentContext: types.HookContext | null = null;
    const contexts = new Map<symbol, any>();

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    /**
     * Set current hook context (internal use)
     */
    export function setHookContext(context: types.HookContext | null): void {
    currentContext = context;
    }

    /**
     * Get current hook (internal use)
     */
    function getHook<T>(initialValue: T): { value: T; index: number } {
    if (!currentContext) {
        throw new Error('Hooks can only be called inside a component');
    }

    const index = currentContext.currentHookIndex++;

    if (!currentContext.hooks[index]) {
        currentContext.hooks[index] = { value: initialValue };
    }

    const hook = currentContext.hooks[index];
    if (!hook || typeof hook !== 'object' || !('value' in hook)) {
        throw new Error('Invalid hook state');
    }

    return {
        value: (hook as { value: T }).value,
        index
    };
    }

    /**
     * Update hook value (internal use)
     */
    function setHook(index: number, value: unknown): void {
    if (currentContext && currentContext.hooks[index]) {
        const hook = currentContext.hooks[index];
        if (hook && typeof hook === 'object' && 'value' in hook) {
            (hook as { value: unknown }).value = value;
        }
    }
    }

    /**
     * Returns a stateful value and a function to update it
     * @param initialValue - Initial state value
     */
    export function useState<T>(
    initialValue: T | (() => T)
    ): [Signal<T>, (action: types.SetStateAction<T>) => void] {
    const hook = getHook<Signal<T> | null>(null);

    // Create signal on first call
    if (!hook.value) {
        const initial = typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;

        const sig = signal<T>(initial);
        hook.value = sig;
        setHook(hook.index, sig);
    }

    const sig = hook.value;

    const setState = (action: types.SetStateAction<T>) => {
        if (typeof action === 'function') {
        sig.update(action as (prev: T) => T);
        } else {
        sig.set(action);
        }
    };

    return [sig, setState];
    }

    /**
     * Runs side effects after render
     * @param callback - Effect function
     * @param deps - Dependency array
     */
    export function useEffect(
    callback: types.EffectCallback,
    deps?: types.DependencyList
    ): void {
    const hook = getHook<{
        cleanup?: () => void
        prevDeps?: types.DependencyList
    }>({});

    // Check if deps changed
    const depsChanged = !hook.value.prevDeps ||
        !deps ||
        deps.length !== hook.value.prevDeps.length ||
        deps.some((dep, i) => !Object.is(dep, hook.value.prevDeps![i]));

    if (depsChanged) {
        // Run cleanup from previous effect
        if (hook.value.cleanup) {
        hook.value.cleanup();
        }

        // Run new effect
        const cleanup = callback();

        // Store cleanup and deps
        hook.value.cleanup = cleanup || undefined;
        hook.value.prevDeps = deps;
        setHook(hook.index, hook.value);
    }
    }

    /**
     * Returns a memoized value
     * @param factory - Function that returns value to memoize
     * @param deps - Dependency array
     */
    export function useMemo<T>(
    factory: () => T,
    deps: types.DependencyList
    ): T {
    const hook = getHook<{
        value: T
        prevDeps: types.DependencyList
    } | null>(null);

    // Check if deps changed
    const depsChanged = !hook.value ||
        deps.length !== hook.value.prevDeps.length ||
        deps.some((dep, i) => !Object.is(dep, hook.value!.prevDeps[i]));

    if (depsChanged) {
        // Recompute value
        const value = factory();
        const newHook = { value, prevDeps: deps };
        setHook(hook.index, newHook);
        return value;
    }

    return hook.value!.value;
    }

    /**
     * Returns a memoized callback
     * @param callback - Function to memoize
     * @param deps - Dependency array
     */
    export function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: types.DependencyList
    ): T {
    return useMemo(() => callback, deps);
    }

    /**
     * Returns a mutable ref object
     * @param initialValue - Initial ref value
     */
    export function useRef<T>(initialValue: T): { current: T } {
    const hook = getHook<{ current: T } | null>(null);

    if (!hook.value) {
        const ref = { current: initialValue };
        setHook(hook.index, ref);
        return ref;
    }

    return hook.value;
    }

    /**
     * Create a signal (CruxJS native)
     * @param initialValue - Initial signal value
     */
    export function useSignal<T>(initialValue: T): Signal<T> {
    const hook = getHook<Signal<T> | null>(null);

    if (!hook.value) {
        const sig = signal(initialValue);
        setHook(hook.index, sig);
        return sig;
    }

    return hook.value;
    }

    /**
     * Create a computed signal
     * @param fn - Computation function
     */
    export function useComputed<T>(fn: () => T): Signal<T> {
    const hook = getHook<Signal<T> | null>(null);

    if (!hook.value) {
        const comp = computed(fn);
        setHook(hook.index, comp);
        return comp;
    }

    return hook.value;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ ════ ════════════════════════════════════════╗

    // useReducer - Reducer Hook

    /**
     * Returns state and dispatch function (like Redux)
     * @param reducer - Reducer function
     * @param initialState - Initial state
     */
    export function useReducer<S, A>(
    reducer: types.Reducer<S, A>,
    initialState: S
    ): [Signal<S>, (action: A) => void] {
    const [state, setState] = useState(initialState);

    const dispatch = (action: A) => {
        setState(prev => {
        const prevValue = typeof prev === 'function' ? (prev as any)() : prev;
        return reducer(prevValue, action);
        });
    };

    return [state, dispatch];
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ ════ ════════════════════════════════════════╗

    // useContext - Context Hook

    /**
     * Create a context
     */
    export function createContext<T>(defaultValue: T): types.Context<T> {
    return {
        _symbol: Symbol('context'),
        defaultValue
    };
    }

    /**
     * Use context value
     */
    export function useContext<T>(context: types.Context<T>): T {
    const value = contexts.get(context._symbol);
    return value !== undefined ? value : context.defaultValue;
    }

    /**
     * Provide context value
     */
    export function ContextProvider<T>(props: {
    context: types.Context<T>
    value: T
    children: any
    }): any {
    // Store context value
    contexts.set(props.context._symbol, props.value);

    // Return children
    return props.children;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ ════ ════════════════════════════════════════╗

    // CUSTOM HOOKS - Common Patterns

    /**
     * Toggle boolean state
     */
    export function useToggle(initialValue = false): [Signal<boolean>, () => void] {
    const [state, setState] = useState(initialValue);
    const toggle = () => setState(prev => {
        const prevValue = typeof prev === 'function' ? (prev as any)() : prev;
        return !prevValue;
    });
    return [state, toggle];
    }

    /**
     * Previous value
     */
    export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
    }

    /**
     * Counter with increment/decrement
     */
    export function useCounter(initialValue = 0) {
    const [count, setCount] = useState(initialValue);

    return {
        count,
        increment: () => setCount(prev => {
        const prevValue = typeof prev === 'function' ? (prev as any)() : prev;
        return prevValue + 1;
        }),
        decrement: () => setCount(prev => {
        const prevValue = typeof prev === 'function' ? (prev as any)() : prev;
        return prevValue - 1;
        }),
        reset: () => setCount(initialValue)
    };
    }

    /**
     * Local storage state
     */
    export function useLocalStorage<T>(
    key: string,
    initialValue: T
    ): [Signal<T>, (value: T) => void] {
    // Get initial value from localStorage
    const stored = localStorage.getItem(key);
    const initial = stored ? JSON.parse(stored) : initialValue;

    const [state, setState] = useState<T>(initial);

    // Update localStorage when state changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state()));
    }, [state()]);

    return [state, setState];
    }

    /**
     * Debounced value
     */
    export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
        setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue();
    }

    /**
     * Interval hook
     */
    export function useInterval(callback: () => void, delay: number | null): void {
    const savedCallback = useRef(callback);

    // Remember latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up interval
    useEffect(() => {
        if (delay === null) return;

        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
    }

    /**
     * Window size
     */
    export function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size();
    }

    /**
     * Media query
     */
    export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(
        () => window.matchMedia(query).matches
    );

    useEffect(() => {
        const media = window.matchMedia(query);

        const listener = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
        };

        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches();
    }

    /**
     * Event listener
     */
    export function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    element: Window | HTMLElement = window
    ): void {
    const savedHandler = useRef(handler);

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const listener = (event: Event) => {
        savedHandler.current(event as WindowEventMap[K]);
        };

        element.addEventListener(eventName, listener);
        return () => element.removeEventListener(eventName, listener);
    }, [eventName, element]);
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ ════ ════════════════════════════════════════╗

    export default {
        // Core hooks
        useState,
        useEffect,
        useMemo,
        useCallback,
        useRef,
        useReducer,
        useContext,

        // CruxJS hooks
        useSignal,
        useComputed,

        // Custom hooks
        useToggle,
        usePrevious,
        useCounter,
        useLocalStorage,
        useDebounce,
        useInterval,
        useWindowSize,
        useMediaQuery,
        useEventListener,

        // Context
        createContext,
        ContextProvider
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
