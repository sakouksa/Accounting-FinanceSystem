import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import '@fontsource/kantumruy-pro';
import '@fontsource/kantumruy-pro/700.css';

import AppRoutes from './routes';
import { AntdGlobalRegister } from './util/message';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Kantumruy Pro', sans-serif",
          fontSize: 15,
          colorPrimary: '#10b981',
        },
      }}
    >
      <AntdApp>
        <AntdGlobalRegister />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
