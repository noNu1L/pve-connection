import { useState } from 'react';
import { useApp } from '../context';
import type { Connection } from '../types';

const CONN_TYPES = [
  { value: 'rdp', label: 'RDP' }, { value: 'ssh', label: 'SSH' },
  { value: 'smb', label: 'SMB' }, { value: 'link', label: '链接' }, { value: 'other', label: '其他' },
];
const PORT_DEFAULTS: Record<string, number | null> = { rdp: 3389, ssh: 22, smb: 455, link: null, other: null };

export default function ConnectionTable() {
  const { connections, setConnections, editMode, addConnection, saveConnectionOnBlur,
    deleteConnection, downloadRDP, downloadSSH, downloadSMB, openLink, showConfirm } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 不可变更新：创建新数组触发 re-render
  const updateConn = (idx: number, patch: Partial<Connection>) => {
    setConnections(connections.map((c, i) => i === idx ? { ...c, ...patch } : c));
  };

  const handleTypeChange = (idx: number, v: string) => {
    const patch = { connType: v as Connection['connType'], port: PORT_DEFAULTS[v] };
    const updated = { ...connections[idx], ...patch };
    setConnections(connections.map((c, i) => i === idx ? updated : c));
    saveConnectionOnBlur(updated);
  };

  return (
    <div>
      <div className="section-heading">
        <span>连接信息</span>
        {editMode && (
          <button className="btn btn-primary btn-sm" onClick={addConnection}>+ 添加连接</button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="pve-table">
          <thead>
            <tr>
              <th>名称</th><th>类型</th><th>地址</th><th>端口</th>
              <th>用户名</th><th style={{width:160, minWidth:160}}>密码</th><th>快捷连接</th>
              {editMode && <th>操作</th>}
            </tr>
          </thead>
          <tbody>
            {connections.map((conn, idx) => (
              <tr key={idx}>
                <td>
                  {editMode
                    ? <input className="pve-input" style={{minWidth:120}} value={conn.name}
                        onChange={e => updateConn(idx, { name: e.target.value })}
                        onBlur={() => saveConnectionOnBlur(conn)} />
                    : <span style={{fontWeight:500}}>{conn.name || '-'}</span>}
                </td>
                <td>
                  {editMode
                    ? <select className="pve-select" value={conn.connType}
                        onChange={e => handleTypeChange(idx, e.target.value)}>
                        {CONN_TYPES.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
                      </select>
                    : <span className="mono">{conn.connType || '-'}</span>}
                </td>
                <td>
                  {editMode
                    ? <input className="pve-input" style={{minWidth:180}} value={conn.address}
                        onChange={e => updateConn(idx, { address: e.target.value })}
                        onBlur={() => saveConnectionOnBlur(conn)} />
                    : <span className="mono">{conn.address || '-'}</span>}
                </td>
                <td>
                  {editMode
                    ? <input className="pve-input" style={{width:80}} type="number"
                        value={conn.port ?? ''}
                        disabled={conn.connType === 'smb'}
                        onChange={e => updateConn(idx, { port: e.target.value ? Number(e.target.value) : null })}
                        onBlur={() => saveConnectionOnBlur(conn)} />
                    : <span className="mono">{conn.port || '-'}</span>}
                </td>
                <td>
                  {editMode
                    ? <input className="pve-input" style={{minWidth:100}} value={conn.username}
                        onChange={e => updateConn(idx, { username: e.target.value })}
                        onBlur={() => saveConnectionOnBlur(conn)} />
                    : conn.username || '-'}
                </td>
                <td style={{width:160, minWidth:160, maxWidth:160, overflow:'hidden'}}
                    onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                  {editMode
                    ? <input className="pve-input" value={conn.password}
                        onChange={e => updateConn(idx, { password: e.target.value })}
                        onBlur={() => saveConnectionOnBlur(conn)} />
                    : <span className="mono" style={{display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                        {hoveredIdx === idx ? (conn.password || '-') : (conn.password ? '••••••' : '-')}
                      </span>}
                </td>
                <td>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    {conn.connType === 'rdp'  && <button className="btn btn-info btn-sm"    onClick={() => downloadRDP(conn)}>下载 RDP</button>}
                    {conn.connType === 'ssh'  && <button className="btn btn-danger btn-sm"  onClick={() => downloadSSH(conn)}>下载 SSH</button>}
                    {conn.connType === 'smb'  && <button className="btn btn-warning btn-sm" onClick={() => downloadSMB(conn)}>下载 SMB</button>}
                    {conn.connType === 'link' && <button className="btn btn-success btn-sm" onClick={() => openLink(conn)}>打开链接</button>}
                    {conn.connType === 'other' && <span style={{color:'var(--text-muted)'}}>-</span>}
                  </div>
                </td>
                {editMode && (
                  <td>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => showConfirm('确认要删除这条连接信息吗？', () => deleteConnection(conn, idx))}>
                      删除
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {connections.length === 0 && (
              <tr><td colSpan={editMode ? 8 : 7} style={{textAlign:'center',color:'var(--text-muted)',padding:'24px 0'}}>暂无连接信息</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
