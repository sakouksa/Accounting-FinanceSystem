import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import '@fontsource/kantumruy-pro';
import '@fontsource/kantumruy-pro/700.css';

import AppRoutes from './routes';

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
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;