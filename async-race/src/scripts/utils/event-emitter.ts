import { Listener } from '../types/types';

export default class EventEmitter {
  private static listeners: { [event: string]: Listener[] } = {};

  public on(event: string, listener: Listener): Listener {
    if (!EventEmitter.listeners[event]) {
      EventEmitter.listeners[event] = [];
    }
    EventEmitter.listeners[event].push(listener);
    return listener;
  }

  public off(event: string, listener: Listener): void {
    if (EventEmitter.listeners[event]) {
      EventEmitter.listeners[event] = EventEmitter.listeners[event].filter((l) => l !== listener);
    }
  }

  public emit(event: string, ...args: string[]): void {
    if (EventEmitter.listeners[event]) {
      EventEmitter.listeners[event].forEach((listener) => {
        listener(...args);
      });
    }
  }
}
