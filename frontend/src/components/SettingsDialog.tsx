import { useEffect } from 'react';
import { useApp } from '../context';
import { fetchConfig } from '../api';

export default function SettingsDialog() {
  const {
    settingsDialogVisible, settings, setSettings,
    setSettingsDialogVisible, saveSettings,
  } = useApp();

  useEffect(() => {
    if (!settingsDialogVisible) return;
    fetchConfig()
      .then(res => {
        if (res.success && res.data) {
          setSettings({
            pve_ip: res.data.pve_ip || '',
            pve_port: res.data.pve_port || '8006',
            pve_username: res.data.pve_username || '',
            pve_password: res.data.pve_password || '',
            menu_show_description_bool: res.data.menu_show_description === '1',
          });
        }
      })
      .catch(() => {});
  }, [settingsDialogVisible, setSettings]);

  const close = () => setSettingsDialogVisible(false);

  return (
    <div className={`modal ${settingsDialogVisible ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={close} />
      <div className="modal-card" style={{ maxWidth: 600 }}>
        <header className="modal-card-head">
          <p className="modal-card-title">系统设置</p>
          <button className="delete" aria-label="close" onClick={close} />
        </header>

        <section className="modal-card-body">
          {/* PVE IP */}
          <div className="field">
            <label className="label">PVE IP地址</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="例如: 192.168.1.100"
                value={settings.pve_ip}
                onChange={e => setSettings({ ...settings, pve_ip: e.target.value })}
              />
            </div>
          </div>

          {/* PVE Port */}
          <div className="field">
            <label className="label">PVE 端口</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="默认: 8006"
                value={settings.pve_port}
                onChange={e => setSettings({ ...settings, pve_port: e.target.value })}
              />
            </div>
          </div>

          {/* PVE Username */}
          <div className="field">
            <label className="label">PVE 用户名</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="例如: root@pam"
                value={settings.pve_username}
                onChange={e => setSettings({ ...settings, pve_username: e.target.value })}
              />
            </div>
          </div>

          {/* PVE Password */}
          <div className="field">
            <label className="label">PVE 密码</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="请输入密码"
                value={settings.pve_password}
                onChange={e => setSettings({ ...settings, pve_password: e.target.value })}
              />
            </div>
          </div>

          {/* Menu show description */}
          <div className="field">
            <label className="label">菜单显示备注</label>
            <div className="control" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={settings.menu_show_description_bool}
                  onChange={e => setSettings({ ...settings, menu_show_description_bool: e.target.checked })}
                />
                <span className="slider" />
              </label>
              <span className="is-size-7 has-text-grey">
                {settings.menu_show_description_bool ? '显示' : '隐藏'}
              </span>
            </div>
          </div>
        </section>

        <footer className="modal-card-foot" style={{ justifyContent: 'flex-end', gap: 8 }}>
          <button className="button" onClick={close}>取消</button>
          <button className="button is-primary" onClick={saveSettings}>保存</button>
        </footer>
      </div>
    </div>
  );
}
