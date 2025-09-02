import { useMemo } from 'react';
import { useCounterStore } from '../stores/counterStore';

export interface CounterViewModel {
  value: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

export function useCounterViewModel(): CounterViewModel {
  const { counter, increase, decrease, reset } = useCounterStore();

  return useMemo(
    () => ({
      value: counter.value,
      increase,
      decrease,
      reset,
    }),
    [counter.value, increase, decrease, reset]
  );
}


