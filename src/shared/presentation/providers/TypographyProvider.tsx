import React, { createContext, useContext } from 'react';
import { TypographyScale, typography } from '@theme/typography';

interface TypographyContextValue {
  scale: TypographyScale;
}

const TypographyContext = createContext<TypographyContextValue>({ scale: typography });

interface TypographyProviderProps {
  children: React.ReactNode;
}

export const TypographyProvider: React.FC<TypographyProviderProps> = ({ children }) => {
  return (
    <TypographyContext.Provider value={{ scale: typography }}>
      {children}
    </TypographyContext.Provider>
  );
};

export const useTypography = () => useContext(TypographyContext);



