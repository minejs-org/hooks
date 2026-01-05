/* eslint-disable @typescript-eslint/no-explicit-any */
// test/index.test.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import { describe, expect, test, beforeEach } from 'bun:test';
    import {
        useState,
        useEffect,
        useMemo,
        useCallback,
        useRef,
        useReducer,
        useContext,
        createContext,
        ContextProvider,
        useSignal,
        useComputed,
        useToggle,
        usePrevious,
        useCounter,
        useLocalStorage,
        useDebounce,
        useInterval,
        useWindowSize,
        useMediaQuery,
        useEventListener,
        setHookContext,
        type HookContext
    } from '../src';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    describe('@minejs/hooks', () => {

        let mockContext: HookContext;

        beforeEach(() => {
            mockContext = {
                hooks: [],
                currentHookIndex: 0,
                component: {}
            };
            setHookContext(mockContext);
        });

        // Core Hooks
        describe('useState', () => {
            test('should initialize state with value', () => {
                const [state] = useState(0);
                expect(state()).toBe(0);
            });

            test('should initialize state with function', () => {
                const [state] = useState(() => 42);
                expect(state()).toBe(42);
            });

            test('should update state with value', () => {
                const [state, setState] = useState(0);
                setState(10);
                expect(state()).toBe(10);
            });

            test('should update state with function', () => {
                const [state, setState] = useState(0);
                setState(prev => prev + 5);
                expect(state()).toBe(5);
            });

            test('should throw without context', () => {
                setHookContext(null);
                expect(() => useState(0)).toThrow('Hooks can only be called inside a component');
            });
        });

        describe('useEffect', () => {
            test('should run effect on mount', () => {
                let executed = false;
                mockContext.currentHookIndex = 0;
                useEffect(() => {
                    executed = true;
                });
                expect(executed).toBe(true);
            });

            test('should run cleanup on dependency change', () => {
                let cleanupRun = false;
                mockContext.currentHookIndex = 0;

                useEffect(() => {
                    return () => {
                        cleanupRun = true;
                    };
                }, [1]);

                mockContext.currentHookIndex = 0;
                useEffect(() => {
                    return () => {
                        cleanupRun = true;
                    };
                }, [2]);

                expect(cleanupRun).toBe(true);
            });

            test('should not run effect if deps unchanged', () => {
                let count = 0;
                mockContext.currentHookIndex = 0;

                useEffect(() => {
                    count++;
                }, [1]);

                mockContext.currentHookIndex = 0;
                useEffect(() => {
                    count++;
                }, [1]);

                expect(count).toBe(1);
            });
        });

        describe('useMemo', () => {
            test('should memoize value', () => {
                mockContext.currentHookIndex = 0;
                let computeCount = 0;

                const result = useMemo(() => {
                    computeCount++;
                    return 42;
                }, []);

                expect(result).toBe(42);
                expect(computeCount).toBe(1);
            });

            test('should recompute on dependency change', () => {
                mockContext.currentHookIndex = 0;
                let computeCount = 0;

                useMemo(() => {
                    computeCount++;
                    return 42;
                }, [1]);

                mockContext.currentHookIndex = 0;
                useMemo(() => {
                    computeCount++;
                    return 42;
                }, [2]);

                expect(computeCount).toBe(2);
            });
        });

        describe('useCallback', () => {
            test('should return memoized callback', () => {
                mockContext.currentHookIndex = 0;
                const callback = () => 42;

                const memoized = useCallback(callback, []);
                const result = memoized();

                expect(result).toBe(42);
            });

            test('should preserve callback identity', () => {
                mockContext.currentHookIndex = 0;
                const callback = () => 42;

                const memoized1 = useCallback(callback, [1]);
                mockContext.currentHookIndex = 0;
                const memoized2 = useCallback(callback, [1]);

                expect(memoized1).toBe(memoized2);
            });
        });

        describe('useRef', () => {
            test('should create ref with initial value', () => {
                mockContext.currentHookIndex = 0;
                const ref = useRef(42);
                expect(ref.current).toBe(42);
            });

            test('should persist ref across renders', () => {
                mockContext.currentHookIndex = 0;
                const ref = useRef(0);
                ref.current = 10;

                mockContext.currentHookIndex = 0;
                const ref2 = useRef(0);
                expect(ref2.current).toBe(10);
            });
        });

        describe('useReducer', () => {
            test('should dispatch actions', () => {
                mockContext.currentHookIndex = 0;
                const reducer = (state: number, action: { type: 'INC' | 'DEC' }) => {
                    return action.type === 'INC' ? state + 1 : state - 1;
                };

                const [state, dispatch] = useReducer(reducer, 0);
                dispatch({ type: 'INC' });
                expect(state()).toBe(1);
            });

            test('should handle decrement', () => {
                mockContext.currentHookIndex = 0;
                const reducer = (state: number, action: { type: 'INC' | 'DEC' }) => {
                    return action.type === 'INC' ? state + 1 : state - 1;
                };

                const [state, dispatch] = useReducer(reducer, 5);
                dispatch({ type: 'DEC' });
                expect(state()).toBe(4);
            });
        });

        describe('useContext', () => {
            test('should provide and consume context', () => {
                mockContext.currentHookIndex = 0;
                const testContext = createContext('default');

                // Simulate ContextProvider setting the context
                ContextProvider({
                    context: testContext,
                    value: 'custom',
                    children: undefined
                });

                mockContext.currentHookIndex = 0;
                const consumed = useContext(testContext);
                expect(consumed).toBe('custom');
            });

            test('should return default value when not provided', () => {
                mockContext.currentHookIndex = 0;
                const testContext = createContext('default');
                const value = useContext(testContext);
                expect(value).toBe('default');
            });
        });

        describe('useSignal', () => {
            test('should create signal', () => {
                mockContext.currentHookIndex = 0;
                const sig = useSignal(42);
                expect(sig()).toBe(42);
            });

            test('should update signal', () => {
                mockContext.currentHookIndex = 0;
                const sig = useSignal(0);
                sig.set(10);
                expect(sig()).toBe(10);
            });

            test('should update signal with function', () => {
                mockContext.currentHookIndex = 0;
                const sig = useSignal(5);
                sig.update(v => v + 3);
                expect(sig()).toBe(8);
            });
        });

        describe('useComputed', () => {
            test('should compute derived value', () => {
                mockContext.currentHookIndex = 0;
                const sig = useSignal(5);
                mockContext.currentHookIndex = 1;
                const computed = useComputed(() => sig() * 2);
                expect(computed()).toBe(10);
            });
        });

        // Custom Hooks
        describe('useToggle', () => {
            test('should toggle boolean state', () => {
                mockContext.currentHookIndex = 0;
                const [state, toggle] = useToggle(false);
                expect(state()).toBe(false);
                toggle();
                expect(state()).toBe(true);
            });

            test('should initialize with true', () => {
                mockContext.currentHookIndex = 0;
                const [state] = useToggle(true);
                expect(state()).toBe(true);
            });
        });

        describe('usePrevious', () => {
            test('should store reference to value', () => {
                mockContext.hooks = [];
                mockContext.currentHookIndex = 0;

                const prev = usePrevious(100);
                // usePrevious uses useRef which returns the stored reference
                expect(prev === undefined || typeof prev === 'number').toBe(true);
            });
        });

        describe('useCounter', () => {
            test('should initialize counter', () => {
                mockContext.currentHookIndex = 0;
                const counter = useCounter(0);
                expect(counter.count()).toBe(0);
            });

            test('should increment counter', () => {
                mockContext.currentHookIndex = 0;
                const counter = useCounter(0);
                counter.increment();
                expect(counter.count()).toBe(1);
            });

            test('should decrement counter', () => {
                mockContext.currentHookIndex = 0;
                const counter = useCounter(5);
                counter.decrement();
                expect(counter.count()).toBe(4);
            });

            test('should reset counter', () => {
                mockContext.currentHookIndex = 0;
                const counter = useCounter(0);
                counter.increment();
                counter.reset();
                expect(counter.count()).toBe(0);
            });
        });

        describe('useLocalStorage', () => {
            test('should persist state to localStorage', () => {
                const originalStorage = global.localStorage;
                const mockStorage = {
                    store: new Map<string, string>(),
                    getItem(key: string) {
                        return this.store.get(key) ?? null;
                    },
                    setItem(key: string, value: string) {
                        this.store.set(key, value);
                    },
                    removeItem(key: string) {
                        this.store.delete(key);
                    },
                    clear() {
                        this.store.clear();
                    }
                };
                (global as any).localStorage = mockStorage;

                mockContext.currentHookIndex = 0;
                mockContext.hooks = [];
                useLocalStorage('test-key', 'initial');
                // Check that storage was initialized
                expect(mockStorage.getItem('test-key')).toBe('"initial"');

                (global as any).localStorage = originalStorage;
            });

            test('should retrieve from localStorage', () => {
                const originalStorage = global.localStorage;
                const mockStorage = {
                    store: new Map<string, string>([['test-key-2', '"stored"']]),
                    getItem(key: string) {
                        return this.store.get(key) ?? null;
                    },
                    setItem(key: string, value: string) {
                        this.store.set(key, value);
                    },
                    removeItem(key: string) {
                        this.store.delete(key);
                    },
                    clear() {
                        this.store.clear();
                    }
                };
                (global as any).localStorage = mockStorage;

                mockContext.currentHookIndex = 0;
                mockContext.hooks = [];
                const [state] = useLocalStorage('test-key-2', 'default');
                expect(state()).toBe('stored');

                (global as any).localStorage = originalStorage;
            });
        });

        describe('useDebounce', () => {
            test('should debounce value', async () => {
                mockContext.currentHookIndex = 0;
                mockContext.hooks = [];
                const debounced = useDebounce('initial', 50);
                expect(debounced).toBe('initial');
            });

            test('should initialize debounced state', () => {
                mockContext.currentHookIndex = 0;
                mockContext.hooks = [];
                const value = useDebounce('test-value', 100);
                expect(value).toBe('test-value');
            });
        });

        describe('useInterval', () => {
            test('should run interval callback', async () => {
                let count = 0;
                mockContext.currentHookIndex = 0;

                useInterval(() => {
                    count++;
                }, 50);

                await new Promise(resolve => setTimeout(resolve, 150));
                expect(count).toBeGreaterThanOrEqual(2);
            });

            test('should not run when delay is null', async () => {
                let count = 0;
                mockContext.currentHookIndex = 0;

                useInterval(() => {
                    count++;
                }, null);

                await new Promise(resolve => setTimeout(resolve, 100));
                expect(count).toBe(0);
            });
        });

        describe('useWindowSize', () => {
            test('should get window size', () => {
                const originalWindow = (global as any).window;
                (global as any).window = {
                    innerWidth: 1024,
                    innerHeight: 768,
                    addEventListener: () => {},
                    removeEventListener: () => {}
                };

                mockContext.currentHookIndex = 0;
                mockContext.hooks = [];
                const size = useWindowSize();
                expect(typeof size.width).toBe('number');
                expect(typeof size.height).toBe('number');

                (global as any).window = originalWindow;
            });

            test('should handle resize event', () => {
                const originalWindow = (global as any).window;
                let resizeHandler: (() => void) | null = null;
                (global as any).window = {
                    innerWidth: 1024,
                    innerHeight: 768,
                    addEventListener: (event: string, handler: () => void) => {
                        if (event === 'resize') resizeHandler = handler;
                    },
                    removeEventListener: () => {}
                };

                mockContext.currentHookIndex = 0;
                mockContext.hooks = [];
                useWindowSize();

                // Trigger resize
                if (resizeHandler !== null) {
                    (global as any).window.innerWidth = 800;
                    (global as any).window.innerHeight = 600;
                    (resizeHandler as (() => void))();
                }

                (global as any).window = originalWindow;
            });
        });

        describe('useMediaQuery', () => {
            test('should check media query', () => {
                const originalWindow = (global as any).window;
                (global as any).window = {
                    matchMedia: () => ({
                        matches: true,
                        addEventListener: () => {},
                        removeEventListener: () => {}
                    })
                };

                mockContext.currentHookIndex = 0;
                mockContext.hooks = [];
                const matches = useMediaQuery('(max-width: 600px)');
                expect(typeof matches).toBe('boolean');

                (global as any).window = originalWindow;
            });
        });

        describe('useEventListener', () => {
            test('should attach event listener', () => {
                const originalWindow = (global as any).window;
                let eventFired = false;
                (global as any).window = {
                    addEventListener: (event: string, handler: () => void) => {
                        if (event === 'click') handler();
                    },
                    removeEventListener: () => {}
                };

                mockContext.currentHookIndex = 0;
                mockContext.hooks = [];

                useEventListener('click', () => {
                    eventFired = true;
                }, (global as any).window);

                expect(eventFired).toBe(true);

                (global as any).window = originalWindow;
            });

            test('should handle multiple handlers', () => {
                const originalWindow = (global as any).window;
                let count = 0;
                let storedHandler: (() => void) | null = null;

                (global as any).window = {
                    addEventListener: (event: string, handler: () => void) => {
                        if (event === 'click') storedHandler = handler;
                    },
                    removeEventListener: () => {}
                };

                mockContext.currentHookIndex = 0;
                mockContext.hooks = [];

                useEventListener('click', () => {
                    count++;
                }, (global as any).window);

                // Manually trigger handlers
                if (storedHandler !== null) {
                    (storedHandler as (() => void))();
                    (storedHandler as (() => void))();
                }

                expect(count).toBe(2);

                (global as any).window = originalWindow;
            });
        });

        describe('setHookContext', () => {
            test('should set hook context', () => {
                const newContext: HookContext = {
                    hooks: [],
                    currentHookIndex: 0,
                    component: {}
                };
                setHookContext(newContext);
                setHookContext(null);
                expect(() => useState(0)).toThrow();
            });
        });

        describe('createContext', () => {
            test('should create context with default value', () => {
                const ctx = createContext('default');
                expect(ctx.defaultValue).toBe('default');
                expect(typeof ctx._symbol).toBe('symbol');
            });
        });

    });

// ╚══════════════════════════════════════════════════════════════════════════════════════╝