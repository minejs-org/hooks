// src/types.ts
//
// Made with ❤️ by Maysara.

import type { Signal } from '@minejs/signals';

// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

export type SetStateAction<T>   = T | ((prev: T) => T);
export type EffectCallback      = () => void | (() => void);
export type DependencyList      = readonly unknown[];

export interface HookContext {
    hooks                       : unknown[]
    currentHookIndex            : number
    component                   : unknown
}

export type Reducer<S, A> = (state: S, action: A) => S;

export interface Context<T> {
    _symbol: symbol
    defaultValue: T
}

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
