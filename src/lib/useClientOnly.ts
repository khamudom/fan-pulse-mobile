"use client";

import { useSyncExternalStore } from "react";

let clientNowMs = 0;

function subscribeOnClient(onStoreChange: () => void) {
  if (clientNowMs === 0) {
    clientNowMs = Date.now();
  }
  queueMicrotask(onStoreChange);
  return () => {};
}

function getClientTrue(): boolean {
  return true;
}

function getServerFalse(): boolean {
  return false;
}

/** True after the component has mounted in the browser. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeOnClient,
    getClientTrue,
    getServerFalse,
  );
}

function getClientNowMs(): number {
  return clientNowMs;
}

function getServerNowMs(): number {
  return 0;
}

/** Current browser time, available after client hydration. */
export function useClientTime(): { now: Date; isReady: boolean } {
  const ms = useSyncExternalStore(
    subscribeOnClient,
    getClientNowMs,
    getServerNowMs,
  );

  return {
    now: new Date(ms),
    isReady: ms > 0,
  };
}

let tickingMs = 0;
const tickingListeners = new Set<() => void>();
const tickingTimers = new Map<number, number>();

function notifyTickingListeners(): void {
  tickingListeners.forEach((listener) => listener());
}

function getTickingSubscribe(intervalMs: number) {
  return function subscribe(onStoreChange: () => void) {
    tickingListeners.add(onStoreChange);

    if (tickingListeners.size === 1) {
      tickingMs = Date.now();
      queueMicrotask(notifyTickingListeners);

      if (intervalMs > 0 && !tickingTimers.has(intervalMs)) {
        const timer = window.setInterval(() => {
          tickingMs = Date.now();
          notifyTickingListeners();
        }, intervalMs);
        tickingTimers.set(intervalMs, timer);
      }
    }

    return () => {
      tickingListeners.delete(onStoreChange);
      if (tickingListeners.size === 0) {
        tickingTimers.forEach((timer) => window.clearInterval(timer));
        tickingTimers.clear();
        tickingMs = 0;
      }
    };
  };
}

const tickingSubscribeCache = new Map<number, ReturnType<typeof getTickingSubscribe>>();

function getCachedTickingSubscribe(intervalMs: number) {
  let subscribe = tickingSubscribeCache.get(intervalMs);
  if (!subscribe) {
    subscribe = getTickingSubscribe(intervalMs);
    tickingSubscribeCache.set(intervalMs, subscribe);
  }
  return subscribe;
}

function getTickingClientMs(): number {
  return tickingMs;
}

/** Current time, updated on an interval after mount. Pass 0 to read once. */
export function useNow(intervalMs = 1000): { now: Date; isReady: boolean } {
  const ms = useSyncExternalStore(
    getCachedTickingSubscribe(intervalMs),
    getTickingClientMs,
    getServerNowMs,
  );

  return {
    now: new Date(ms),
    isReady: ms > 0,
  };
}
