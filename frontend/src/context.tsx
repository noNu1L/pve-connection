import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AllItem, HostItem, VmItem, HostConnection, VmConnection, AppSettings, Connection } from './types';
import * as api from './api';

// === Toast ===
export interface ToastState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
let toastId = 0;

// === Confirm Dialog ===
export interface ConfirmDialogState {
  message: string;
  onConfirm: () => void;
}

// === Settings ===
const defaultSettings: AppSettings = {
  pve_ip: '',
  pve_port: '8006',
  pve_username: '',
  pve_password: '',
  menu_show_description_bool: true,
};

// === Context Type ===
interface AppContextType {
  hosts: HostItem[];
  vms: VmItem[];
  allItems: AllItem[];
  selectedItem: AllItem | null;
  activeTab: string;
  currentExplain: string;
  connections: Connection[];
  editMode: boolean;
  loading: boolean;
  errorMessage: string;
  settingsDialogVisible: boolean;
  settings: AppSettings;
  showDescription: boolean;
  toast: ToastState | null;
  confirmDialog: ConfirmDialogState | null;

  selectItem: (tab: string) => void;
  setCurrentExplain: (v: string) => void;
  setConnections: (v: Connection[]) => void;
  addConnection: () => void;
  toggleEditMode: () => void;
  setSettingsDialogVisible: (v: boolean) => void;
  setSettings: (v: AppSettings) => void;
  showToast: (type: ToastState['type'], message: string) => void;
  showConfirm: (message: string, onConfirm: () => void) => void;
  hideConfirm: () => void;
  saveExplain: (explain: string) => Promise<void>;
  saveConnectionOnBlur: (conn: Connection) => Promise<void>;
  deleteConnection: (conn: Connection, index: number) => void;
  downloadRDP: (conn: Connection) => void;
  downloadSSH: (conn: Connection) => void;
  downloadSMB: (conn: Connection) => void;
  openLink: (conn: Connection) => void;
  saveSettings: () => Promise<void>;
  reloadApp: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hosts, setHosts] = useState<HostItem[]>([]);
  const [vms, setVms] = useState<VmItem[]>([]);
  const [allItems, setAllItems] = useState<AllItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<AllItem | null>(null);
  const [activeTab, setActiveTab] = useState('');
  const [currentExplain, setCurrentExplain] = useState('');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [settingsDialogVisible, setSettingsDialogVisible] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [showDescription, setShowDescription] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);

  const showToastFn = useCallback((type: ToastState['type'], message: string) => {
    const id = ++toastId;
    setToast({ type, message });
    setTimeout(() => setToast(prev => prev ? null : prev), 3000);
  }, []);

  const showConfirmFn = useCallback((message: string, onConfirm: () => void) => {
    setConfirmDialog({ message, onConfirm });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  const selectItem = useCallback(async (tab: string) => {
    setActiveTab(tab);
    setCurrentExplain('');
    setConnections([]);

    const item = allItems.find(i => {
      if (i.type === 'host') return `host-${i.node}` === tab;
      return String(i.vmid) === tab;
    });
    setSelectedItem(item || null);

    if (!item) return;
    const id = item.type === 'host' ? item.node : item.vmid;
    const type = item.type === 'host' ? 'host' : 'vm';

    try {
      const explain = await api.fetchExplain(id, type);
      setCurrentExplain(explain.explain || '');
    } catch { /* ignore */ }

    try {
      const conns = type === 'host'
        ? await api.fetchHostConnections(item.node)
        : await api.fetchVmConnections((item as VmItem).vmid);
      setConnections(conns);
    } catch { /* ignore */ }
  }, [allItems]);

  const addConnection = useCallback(() => {
    const isHost = selectedItem?.type === 'host';
    const empty: Connection = isHost
      ? { id: null, node: selectedItem!.node, connType: 'rdp', name: '', address: '', port: 3389, username: '', password: '' }
      : { id: null, vmid: selectedItem ? (selectedItem as VmItem).vmid : 0, connType: 'rdp', name: '', address: '', port: 3389, username: '', password: '' };
    setConnections(prev => [...prev, empty]);
  }, [selectedItem]);

  const toggleEditMode = useCallback(() => {
    if (!editMode) {
      showConfirmFn('确认要进入编辑模式吗？', () => {
        setEditMode(true);
        showToastFn('success', '已进入编辑模式');
        hideConfirm();
      });
    } else {
      setEditMode(false);
      showToastFn('info', '已退出编辑模式');
    }
  }, [editMode, showConfirmFn, showToastFn, hideConfirm]);

  const saveExplain = useCallback(async (explain: string) => {
    if (!selectedItem || !editMode) return;
    const id = selectedItem.type === 'host' ? selectedItem.node : selectedItem.vmid;
    const type = selectedItem.type === 'host' ? 'host' : 'vm';
    try {
      await api.saveExplain(id, type, explain);
      showToastFn('success', '保存成功');
    } catch {
      showToastFn('error', '保存失败');
    }
  }, [selectedItem, editMode, showToastFn]);

  const saveConnectionOnBlur = useCallback(async (conn: Connection) => {
    if (!editMode || !conn.connType || !selectedItem) return;
    try {
      const res = selectedItem.type === 'host'
        ? await api.saveHostConnection((selectedItem as HostItem).node, conn as HostConnection)
        : await api.saveVmConnection((selectedItem as VmItem).vmid, conn as VmConnection);
      if (res.success && res.id && !conn.id) {
        conn.id = res.id;
      }
    } catch { /* silent */ }
  }, [editMode, selectedItem]);

  const deleteConnectionFn = useCallback(async (conn: Connection, index: number) => {
    if (conn.id) {
      const type = selectedItem?.type === 'host' ? 'host' : 'vm';
      try {
        if (type === 'host') {
          await api.deleteHostConnection(conn.id);
        } else {
          await api.deleteVmConnection(conn.id);
        }
        showToastFn('success', '删除成功');
        setConnections(prev => prev.filter((_, i) => i !== index));
      } catch {
        showToastFn('error', '删除失败');
      }
    } else {
      setConnections(prev => prev.filter((_, i) => i !== index));
    }
  }, [selectedItem, showToastFn]);

  const downloadRDP = useCallback((conn: Connection) => {
    if (!conn.address) { showToastFn('warning', '请先设置地址'); return; }
    const itemName = selectedItem?.type === 'host' ? (selectedItem as HostItem).node : (selectedItem as VmItem).name;
    const rdp = `screen mode id:i:2
use multimon:i:0
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32
winposstr:s:0,3,0,0,800,600
compression:i:1
keyboardhook:i:2
audiocapturemode:i:0
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
displayconnectionbar:i:1
enableworkspacereconnect:i:0
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:${conn.address}:${conn.port || 3389}
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectclipboard:i:1
redirectposdevices:i:0
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
promptcredentialonce:i:0
gatewaybrokeringtype:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
${conn.username ? 'username:s:' + conn.username : ''}`;

    const blob = new Blob([rdp], { type: 'application/x-rdp' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itemName}-${conn.address}-RDP.rdp`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToastFn('success', 'RDP文件已下载');
  }, [selectedItem, showToastFn]);

  const downloadSSH = useCallback((conn: Connection) => {
    if (!conn.address) { showToastFn('warning', '请先设置地址'); return; }
    const itemName = selectedItem?.type === 'host' ? (selectedItem as HostItem).node : (selectedItem as VmItem).name;
    const port = conn.port || 22;
    const username = conn.username || 'root';
    const password = conn.password || '';
    const bat = `@echo off\r\nXshell.exe -url ssh://${username}:${password}@${conn.address}:${port}\r\n`;

    const blob = new Blob([bat], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itemName}-${conn.address}-SSH.bat`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (!password) {
      showToastFn('warning', 'SSH批处理脚本已下载，但未设置密码');
    } else {
      showToastFn('success', 'SSH批处理脚本已下载，双击运行即可使用Xshell连接');
    }
  }, [selectedItem, showToastFn]);

  const downloadSMB = useCallback((conn: Connection) => {
    if (!conn.address) { showToastFn('warning', '请先设置地址'); return; }
    const itemName = selectedItem?.type === 'host' ? (selectedItem as HostItem).node : (selectedItem as VmItem).name;
    const username = conn.username || '';
    const password = conn.password || '';

    let bat = '@echo off\r\n';
    if (username && password) {
      bat += `cmdkey /add:${conn.address} /user:${username} /pass:${password}\r\n`;
      bat += `net use \\\\${conn.address} /user:"${username}" "${password}" /persistent:no\r\n`;
    } else if (username) {
      bat += `net use \\\\${conn.address} /user:"${username}" /persistent:no\r\n`;
    } else {
      bat += `net use \\\\${conn.address} /persistent:no\r\n`;
    }
    bat += `start \\\\${conn.address}\r\n`;

    const blob = new Blob([bat], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itemName}-${conn.address}-SMB.bat`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (!username || !password) {
      showToastFn('warning', 'SMB连接文件已下载，但未设置用户名或密码');
    } else {
      showToastFn('success', 'SMB连接文件已下载，双击运行即可连接到共享文件夹');
    }
  }, [selectedItem, showToastFn]);

  const openLink = useCallback((conn: Connection) => {
    if (!conn.address) { showToastFn('warning', '请先设置地址'); return; }
    let url = conn.address;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    if (conn.port) {
      url = url + ':' + conn.port;
    }
    window.open(url, '_blank');
  }, [showToastFn]);

  const saveSettingsFn = useCallback(async () => {
    try {
      const res = await api.saveConfig({
        pve_ip: settings.pve_ip,
        pve_port: settings.pve_port,
        pve_username: settings.pve_username,
        pve_password: settings.pve_password,
        menu_show_description: settings.menu_show_description_bool ? '1' : '0',
        first_run: '0',
      });
      if (res.success) {
        showToastFn('success', res.message || '配置保存成功');
        setSettingsDialogVisible(false);
        setTimeout(() => window.location.reload(), 500);
      } else {
        showToastFn('error', res.error || '保存失败');
      }
    } catch (e) {
      showToastFn('error', '保存配置失败: ' + (e as Error).message);
    }
  }, [settings, showToastFn]);

  const reloadApp = useCallback(() => {
    window.location.reload();
  }, []);

  // Initial data load
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        // Parallel: check first run, load menu display setting
        const [firstRun, menuDesc] = await Promise.all([
          api.fetchFirstRun(),
          api.fetchMenuShowDescription(),
        ]);

        if (firstRun.success) {
          setShowDescription(menuDesc.showDescription);
        }

        // Show settings on first run
        if (firstRun.firstRun) {
          const cfg = await api.fetchConfig();
          if (cfg.success && cfg.data) {
            setSettings({
              pve_ip: cfg.data.pve_ip || '',
              pve_port: cfg.data.pve_port || '8006',
              pve_username: cfg.data.pve_username || '',
              pve_password: cfg.data.pve_password || '',
              menu_show_description_bool: cfg.data.menu_show_description === '1',
            });
          }
          setSettingsDialogVisible(true);
        }

        // Load main data
        const data = await api.fetchData();
        if (data.error) {
          setErrorMessage(data.error);
          return;
        }

        const h = data.hosts || [];
        const v = (data.vms || []).slice().sort((a, b) => {
          const order: Record<string, number> = { running: 1, stopped: 2, lost: 3 };
          return (order[a.status] || 999) - (order[b.status] || 999);
        });
        setHosts(h);
        setVms(v);
        const items: AllItem[] = [...h, ...v];
        setAllItems(items);

        if (items.length > 0) {
          const first = items[0];
          const tab = first.type === 'host' ? `host-${first.node}` : String(first.vmid);
          setActiveTab(tab);
          setSelectedItem(first);

          const id = first.type === 'host' ? first.node : first.vmid;
          const type = first.type === 'host' ? 'host' : 'vm';
          try {
            const [explain, conns] = await Promise.all([
              api.fetchExplain(id, type),
              type === 'host'
                ? api.fetchHostConnections(first.node).then(c => c).catch(() => [] as Connection[])
                : api.fetchVmConnections((first as VmItem).vmid).then(c => c).catch(() => [] as Connection[]),
            ]);
            setCurrentExplain(explain.explain || '');
            setConnections(conns);
          } catch { /* ignore */ }
        }
      } catch (e) {
        setErrorMessage('加载数据失败: ' + (e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const ctx: AppContextType = {
    hosts, vms, allItems, selectedItem, activeTab, currentExplain, connections,
    editMode, loading, errorMessage, settingsDialogVisible, settings, showDescription,
    toast, confirmDialog,
    selectItem, setCurrentExplain, setConnections, addConnection,
    toggleEditMode, setSettingsDialogVisible, setSettings,
    showToast: showToastFn, showConfirm: showConfirmFn, hideConfirm,
    saveExplain, saveConnectionOnBlur, deleteConnection: deleteConnectionFn,
    downloadRDP, downloadSSH, downloadSMB, openLink,
    saveSettings: saveSettingsFn, reloadApp,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
