import { useEffect } from 'react';
import { useApp } from '../context';
import { fetchConfig } from '../api';

export default function SettingsDialog() {
  const { settingsDialogVisible, settings, setSettings, setSettingsDialogVisible, saveSettings } = useApp();

  useEffect(() => {
    if (!settingsDialogVisible) return;
    fetchConfig().then(res => {
      if (res.success && res.data) {
        setSettings({
          pve_ip: res.data.pve_ip || '',
          pve_port: res.data.pve_port || '8006',
          pve_username: res.data.pve_username || '',
          pve_password: res.data.pve_password || '',
          menu_show_description_bool: res.data.menu_show_description === '1',
        });
      }
    }).catch(() => {});
  }, [settingsDialogVisible, setSettings]);

  if (!settingsDialogVisible) return null;
  const close = () => setSettingsDialogVisible(false);

  return (
    <div className="pve-modal-bg" onClick={close}>
      <div className="pve-modal" onClick={e => e.stopPropagation()}>
        <div className="pve-modal-head">
          <span className="pve-modal-title">系统设置</span>
          <button className="pve-modal-close" onClick={close}>✕</button>
        </div>
        <div className="pve-modal-body">
          {[
            { label: 'PVE IP 地址', key: 'pve_ip', placeholder: '例如: 192.168.1.100' },
            { label: 'PVE 端口', key: 'pve_port', placeholder: '默认: 8006' },
            { label: 'PVE 用户名', key: 'pve_username', placeholder: '例如: root@pam' },
          ].map(f => (
            <div className="form-field" key={f.key}>
              <label className="form-label">{f.label}</label>
              <input
                className="pve-input"
                placeholder={f.placeholder}
                value={(settings as unknown as Record<string, string>)[f.key]}
                onChange={e => setSettings({ ...settings, [f.key]: e.target.value })}
              />
            </div>
          ))}
          <div className="form-field">
            <label className="form-label">PVE 密码</label>
            <input
              className="pve-input"
              type="password"
              placeholder="请输入密码"
              value={settings.pve_password}
              onChange={e => setSettings({ ...settings, pve_password: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label className="form-label">菜单显示备注</label>
            <div style={{display:'flex',alignItems:'center',gap:10,marginTop:4}}>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={settings.menu_show_description_bool}
                  onChange={e => setSettings({ ...settings, menu_show_description_bool: e.target.checked })}
                />
                <span className="slider" />
              </label>
              <span style={{fontSize:12,color:'var(--text-muted)'}}>
                {settings.menu_show_description_bool ? '显示' : '隐藏'}
              </span>
            </div>
          </div>
        </div>
        <div className="pve-modal-foot">
          <button className="btn btn-ghost" onClick={close}>取消</button>
          <button className="btn btn-primary" onClick={saveSettings}>保存</button>
        </div>
      </div>
    </div>
  );
}
