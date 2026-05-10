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
    <div className="app-shell">
      <Header />

      {errorMessage && (
        <div className="pve-error">{errorMessage}</div>
      )}

      {!errorMessage && allItems.length === 0 && (
        <div className="pve-empty">暂无数据</div>
      )}

      {!errorMessage && allItems.length > 0 && (
        <div className="app-body">
          <div className="sidebar-col">
            <Sidebar />
          </div>
          <div className="detail-col">
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
