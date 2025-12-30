"use client";

import { useEffect, useRef } from 'react';
import { BusinessEvent, EventPayload, eventBus } from './event-bus';

/**
 * React Hook for subscribing to business events
 * Automatically unsubscribes on component unmount
 * 
 * @example
 * useEventSubscription(BusinessEvent.ORDER_CREATED, (payload) => {
 *   console.log('New order:', payload.data);
 *   // Trigger optimistic UI update or refetch
 * });
 */
export function useEventSubscription<T = any>(
  event: BusinessEvent,
  callback: (payload: EventPayload<T>) => void,
  deps: any[]  = []
): void {
  // Use ref to store latest callback to avoid re-subscribing on every render
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Wrapper to use the ref
    const handler = (payload: EventPayload<T>) => {
      callbackRef.current(payload);
    };

    // Subscribe
    const unsubscribe = eventBus.on<T>(event, handler);

    // Cleanup on unmount
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps]);
}

/**
 * React Hook for subscribing to multiple events
 * 
 * @example
 * useMultipleEventSubscription([
 *   { event: BusinessEvent.ORDER_CREATED, callback: handleOrderCreated },
 *   { event: BusinessEvent.PAYMENT_COMPLETED, callback: handlePayment },
 * ]);
 */
export function useMultipleEventSubscription<T = any>(
  subscriptions: Array<{
    event: BusinessEvent;
    callback: (payload: EventPayload<T>) => void;
  }>,
  deps: any[] = []
): void {
  useEffect(() => {
    const unsubscribers = subscriptions.map(({ event, callback }) => {
      return eventBus.on<T>(event, callback);
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
