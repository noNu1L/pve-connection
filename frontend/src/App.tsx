import { AppProvider, useApp } from './context';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DetailPanel from './components/DetailPanel';
import SettingsDialog from './components/SettingsDialog';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import LoadingOverlay from './components/LoadingOverlay';

function AppBody() {
  const { allItems, errorMessage } = useApp();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {errorMessage && (
        <div className="notification is-danger m-3 mb-0">
          {errorMessage}
        </div>
      )}

      {!errorMessage && allItems.length === 0 && (
        <div className="section has-text-centered">
          <p className="has-text-grey">暂无数据</p>
        </div>
      )}

      {!errorMessage && allItems.length > 0 && (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: 280, borderRight: '1px solid #e4e7ed', flexShrink: 0 }} className="sidebar-scroll">
            <Sidebar />
          </div>
          <div style={{ flex: 1 }} className="detail-scroll">
            <DetailPanel />
          </div>
        </div>
      )}

      <SettingsDialog />
      <Toast />
      <ConfirmDialog />
      <LoadingOverlay />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppBody />
    </AppProvider>
  );
}
