import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
};
