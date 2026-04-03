import { CssBaseline } from '@mui/material';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import 'primereact/resources/themes/lara-light-indigo/theme.css';   
import 'primereact/resources/primereact.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import './index.css';
import React from 'react';

// 1. Import the ThemeProvider (check the path to your ThemeContext file)
import { ThemeProvider } from './contexts/ThemeContext'; 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      {/* 2. Wrap everything inside ThemeProvider */}
      <ThemeProvider>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </I18nextProvider>
  </Provider>
);

reportWebVitals();
