'use client'

import { useSyncExternalStore } from 'react'

const subscribe = (callback: () => void) => {
    window.addEventListener('popstate', callback);
    window.addEventListener('pageshow', callback);

    return () => {
        window.removeEventListener('popstate', callback);
        window.removeEventListener('pageshow', callback);
    };
};

const getSnapshot = () => window.history.state ?? null;

export function useLocation() {
    const state = useSyncExternalStore(subscribe, getSnapshot, () => null);

    return { state };
}