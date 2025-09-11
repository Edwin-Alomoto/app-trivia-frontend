import { renderHook, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import React from 'react';

import { store } from '../../store';
import { useRafflesViewModel } from './useRafflesViewModel';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useRafflesViewModel', () => {
  it('carga sorteos en refresh()', async () => {
    const { result } = renderHook(() => useRafflesViewModel(), { wrapper });
    await act(async () => {
      await result.current.refresh();
    });

    expect(Array.isArray(result.current.active)).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });
});
