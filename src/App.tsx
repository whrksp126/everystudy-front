import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { DataProvider } from './contexts/DataContext';
import { ModalProvider as ModalContextProvider } from './contexts/ModalContext';
import { ModalProvider } from './components/Modal/ModalProvider';
import { AlertProvider as AlertContextProvider } from './contexts/AlertContext';
import { AlertProvider } from './components/Alert/AlertProvider';
import { OverflowMenuProvider } from './contexts/OverflowMenuContext';
import './App.css';

function App() {
  return (
    <Router>
      <DataProvider>
        <ModalContextProvider>
          <AlertContextProvider>
            <OverflowMenuProvider>
              <div className="App">
                <AppRoutes />
                <ModalProvider />
                <AlertProvider />
              </div>
            </OverflowMenuProvider>
          </AlertContextProvider>
        </ModalContextProvider>
      </DataProvider>
    </Router>
  );
}

export default App;
