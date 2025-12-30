// ========================================
// EVENT-DRIVEN UI INFRASTRUCTURE
// ========================================
// Placeholder for future event-driven patterns
// Used for: Real-time updates, Optimistic UI, WebSocket integration

/**
 * Event Types for Business Events
 */
export enum BusinessEvent {
  // Order Events
  ORDER_CREATED = 'order.created',
  ORDER_UPDATED = 'order.updated',
  ORDER_CANCELLED = 'order.cancelled',
  
  // Payment Events
  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',
  
  // Inventory Events
  INVENTORY_ADJUSTED = 'inventory.adjusted',
  STOCK_LOW = 'inventory.stock_low',
  STOCK_OUT = 'inventory.stock_out',
  
  // Courier/Delivery Events
  COURIER_STATUS_UPDATED = 'courier.status_updated',
  DELIVERY_ASSIGNED = 'delivery.assigned',
  DELIVERY_COMPLETED = 'delivery.completed',
  
  // Notification Events
  NOTIFICATION_RECEIVED = 'notification.received',
  
  // System Events
  SYNC_REQUIRED = 'system.sync_required',
  CONNECTION_STATUS_CHANGED = 'system.connection_changed',
}

/**
 * Event Payload Interface
 */
export interface EventPayload<T = any> {
  type: BusinessEvent;
  data: T;
  timestamp: number;
  source: 'local' | 'websocket' | 'api';
}

/**
 * Event Listener Callback
 */
export type EventListener<T = any> = (payload: EventPayload<T>) => void;

/**
 * Simple Event Bus (In-Memory)
 * Can be replaced with RxJS, Socket.io, or Pusher later
 */
class EventBus {
  private listeners: Map<BusinessEvent, Set<EventListener>> = new Map();

  /**
   * Subscribe to an event
   */
  on<T>(event: BusinessEvent, listener: EventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.off(event, listener);
    };
  }

  /**
   * Unsubscribe from an event
   */
  off(event: BusinessEvent, listener: EventListener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  /**
   * Emit an event
   */
  emit<T>(event: BusinessEvent, data: T, source: 'local' | 'websocket' | 'api' = 'local'): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const payload: EventPayload<T> = {
        type: event,
        data,
        timestamp: Date.now(),
        source,
      };

      eventListeners.forEach((listener) => {
        try {
          listener(payload);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Clear all listeners for an event
   */
  clear(event?: BusinessEvent): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

// Singleton Event Bus Instance
export const eventBus = new EventBus();

/**
 * Helper to emit events easily
 */
export function emitEvent<T>(event: BusinessEvent, data: T, source?: 'local' | 'websocket' | 'api'): void {
  eventBus.emit(event, data, source);
}
