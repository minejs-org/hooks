import { Signal } from '@minejs/signals';

type SetStateAction<T> = T | ((prev: T) => T);
type EffectCallback = () => void | (() => void);
type DependencyList = readonly any[];
interface HookContext {
    hooks: any[];
    currentHookIndex: number;
    component: any;
}
type Reducer<S, A> = (state: S, action: A) => S;
interface Context<T> {
    _symbol: symbol;
    defaultValue: T;
}

/**
 * Set current hook context (internal use)
 */
declare function setHookContext(context: HookContext | null): void;
/**
 * Returns a stateful value and a function to update it
 * @param initialValue - Initial state value
 */
declare function useState<T>(initialValue: T | (() => T)): [Signal<T>, (action: SetStateAction<T>) => void];
/**
 * Runs side effects after render
 * @param callback - Effect function
 * @param deps - Dependency array
 */
declare function useEffect(callback: EffectCallback, deps?: DependencyList): void;
/**
 * Returns a memoized value
 * @param factory - Function that returns value to memoize
 * @param deps - Dependency array
 */
declare function useMemo<T>(factory: () => T, deps: DependencyList): T;
/**
 * Returns a memoized callback
 * @param callback - Function to memoize
 * @param deps - Dependency array
 */
declare function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
/**
 * Returns a mutable ref object
 * @param initialValue - Initial ref value
 */
declare function useRef<T>(initialValue: T): {
    current: T;
};
/**
 * Create a signal (CruxJS native)
 * @param initialValue - Initial signal value
 */
declare function useSignal<T>(initialValue: T): Signal<T>;
/**
 * Create a computed signal
 * @param fn - Computation function
 */
declare function useComputed<T>(fn: () => T): Signal<T>;
/**
 * Returns state and dispatch function (like Redux)
 * @param reducer - Reducer function
 * @param initialState - Initial state
 */
declare function useReducer<S, A>(reducer: Reducer<S, A>, initialState: S): [Signal<S>, (action: A) => void];
/**
 * Create a context
 */
declare function createContext<T>(defaultValue: T): Context<T>;
/**
 * Use context value
 */
declare function useContext<T>(context: Context<T>): T;
/**
 * Provide context value
 */
declare function ContextProvider<T>(props: {
    context: Context<T>;
    value: T;
    children: any;
}): any;
/**
 * Toggle boolean state
 */
declare function useToggle(initialValue?: boolean): [Signal<boolean>, () => void];
/**
 * Previous value
 */
declare function usePrevious<T>(value: T): T | undefined;
/**
 * Counter with increment/decrement
 */
declare function useCounter(initialValue?: number): {
    count: Signal<number>;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
};
/**
 * Local storage state
 */
declare function useLocalStorage<T>(key: string, initialValue: T): [Signal<T>, (value: T) => void];
/**
 * Debounced value
 */
declare function useDebounce<T>(value: T, delay: number): T;
/**
 * Interval hook
 */
declare function useInterval(callback: () => void, delay: number | null): void;
/**
 * Window size
 */
declare function useWindowSize(): {
    width: number;
    height: number;
};
/**
 * Media query
 */
declare function useMediaQuery(query: string): boolean;
/**
 * Event listener
 */
declare function useEventListener<K extends keyof WindowEventMap>(eventName: K, handler: (event: WindowEventMap[K]) => void, element?: Window | HTMLElement): void;
declare const _default: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useMemo: typeof useMemo;
    useCallback: typeof useCallback;
    useRef: typeof useRef;
    useReducer: typeof useReducer;
    useContext: typeof useContext;
    useSignal: typeof useSignal;
    useComputed: typeof useComputed;
    useToggle: typeof useToggle;
    usePrevious: typeof usePrevious;
    useCounter: typeof useCounter;
    useLocalStorage: typeof useLocalStorage;
    useDebounce: typeof useDebounce;
    useInterval: typeof useInterval;
    useWindowSize: typeof useWindowSize;
    useMediaQuery: typeof useMediaQuery;
    useEventListener: typeof useEventListener;
    createContext: typeof createContext;
    ContextProvider: typeof ContextProvider;
};

export { type Context, ContextProvider, type DependencyList, type EffectCallback, type HookContext, type Reducer, type SetStateAction, createContext, _default as default, setHookContext, useCallback, useComputed, useContext, useCounter, useDebounce, useEffect, useEventListener, useInterval, useLocalStorage, useMediaQuery, useMemo, usePrevious, useReducer, useRef, useSignal, useState, useToggle, useWindowSize };
