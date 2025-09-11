import { renderHook, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import React from 'react';

import { store } from '../../store';
import { useRewardsViewModel } from './useRewardsViewModel';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useRewardsViewModel', () => {
  it('carga premios disponibles en refresh()', async () => {
    const { result } = renderHook(() => useRewardsViewModel(), { wrapper });
    await act(async () => {
      await result.current.refresh();
    });

    expect(Array.isArray(result.current.available)).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });
});
