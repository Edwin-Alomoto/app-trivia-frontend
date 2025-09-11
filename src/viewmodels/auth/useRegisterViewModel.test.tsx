import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';

import { store } from '../../store';
import { useRegisterViewModel } from './useRegisterViewModel';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useRegisterViewModel', () => {
  it('valida reglas de zod y términos', async () => {
    const { result } = renderHook(() => useRegisterViewModel(), { wrapper });

    // Campos vacíos
    let res = await act(async () => await result.current.submit());
    expect(res.ok).toBe(false);

    // Email inválido
    await act(async () => {
      result.current.setField('email', 'bad-email');
      result.current.setField('password', 'Abcdef12');
      result.current.setField('acceptedTerms', true);
      result.current.setField('acceptedPrivacy', true);
    });
    res = await act(async () => await result.current.submit());
    expect(res.ok).toBe(false);
  });

  it('flujo de registro y verificación exitoso', async () => {
    const { result } = renderHook(() => useRegisterViewModel(), { wrapper });

    await act(async () => {
      result.current.setField('email', 'new@example.com');
      result.current.setField('password', 'Abcdef12');
      result.current.setField('acceptedTerms', true);
      result.current.setField('acceptedPrivacy', true);
    });

    const reg = await act(async () => await result.current.submit());
    expect(reg.ok).toBe(true);
    const ver = await act(async () => await result.current.verify());
    expect(ver.ok).toBe(true);
  });
});


