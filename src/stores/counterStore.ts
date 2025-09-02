import { create } from 'zustand';
import type { Counter } from '../models/Counter';

export interface CounterState {
  counter: Counter;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  counter: { value: 0 },
  increase: () => set((state) => ({ counter: { value: state.counter.value + 1 } })),
  decrease: () => set((state) => ({ counter: { value: Math.max(0, state.counter.value - 1) } })),
  reset: () => set({ counter: { value: 0 } }),
}));


