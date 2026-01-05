/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗


    export type SetStateAction<T>   = T | ((prev: T) => T);
    export type EffectCallback      = () => void | (() => void);
    export type DependencyList      = readonly any[];

    export interface HookContext {
        hooks                       : any[]
        currentHookIndex            : number
        component                   : any
    }

    export type Reducer<S, A> = (state: S, action: A) => S;

    export interface Context<T> {
        _symbol: symbol
        defaultValue: T
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
