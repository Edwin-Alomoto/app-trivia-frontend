import { renderHook, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import React from 'react';

import { store } from '../../store';
import { usePointsViewModel } from './usePointsViewModel';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe('usePointsViewModel', () => {
  it('carga balance y transacciones en refresh()', async () => {
    const { result } = renderHook(() => usePointsViewModel(), { wrapper });
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.balance.total).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.current.transactions)).toBe(true);
  });
});
