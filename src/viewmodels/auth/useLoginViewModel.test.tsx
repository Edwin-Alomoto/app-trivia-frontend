import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';

import { store } from '../../store';
import { useLoginViewModel } from './useLoginViewModel';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useLoginViewModel', () => {
  it('valida email requerido y formato inválido', async () => {
    const { result } = renderHook(() => useLoginViewModel(), { wrapper });

    // Email vacío y password vacío
    await act(async () => {
      result.current.setField('email', '');
      result.current.setField('password', '');
    });
    const resEmpty = await act(async () => await result.current.submit());
    expect(resEmpty.ok).toBe(false);

    // Email con formato inválido
    await act(async () => {
      result.current.setField('email', 'invalido');
      result.current.setField('password', '12345678');
    });
    const resInvalidEmail = await act(async () => await result.current.submit());
    expect(resInvalidEmail.ok).toBe(false);
  });

  it('retorna error al fallar credenciales', async () => {
    const { result } = renderHook(() => useLoginViewModel(), { wrapper });

    await act(async () => {
      result.current.setField('email', 'test@example.com');
      result.current.setField('password', 'wrong');
    });

    const res = await act(async () => await result.current.submit());
    expect(res.ok).toBe(false);
  });

  it('login exitoso con credenciales válidas', async () => {
    const { result } = renderHook(() => useLoginViewModel(), { wrapper });

    await act(async () => {
      result.current.setField('email', 'test@example.com');
      result.current.setField('password', '12345678');
    });

    const res = await act(async () => await result.current.submit());
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.user.email).toBe('test@example.com');
    }
  });
});


