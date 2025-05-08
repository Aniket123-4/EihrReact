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


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
      <CssBaseline />
      <App />
      </I18nextProvider>
    </Provider>
  // </React.StrictMode>
);

reportWebVitals();
