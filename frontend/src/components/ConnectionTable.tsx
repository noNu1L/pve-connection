import { useState } from 'react';
import { useApp } from '../context';
import type { Connection } from '../types';

const CONN_TYPES = [
  { value: 'rdp', label: 'RDP' },
  { value: 'ssh', label: 'SSH' },
  { value: 'smb', label: 'SMB' },
  { value: 'link', label: '链接' },
  { value: 'other', label: '其他' },
];

const PORT_DEFAULTS: Record<string, number | null> = {
  rdp: 3389,
  ssh: 22,
  smb: 455,
  link: null,
  other: null,
};

export default function ConnectionTable() {
  const {
    connections, editMode, selectedItem,
    addConnection, saveConnectionOnBlur, deleteConnection,
    downloadRDP, downloadSSH, downloadSMB, openLink,
    showConfirm,
  } = useApp();

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleTypeChange = (conn: Connection, newType: string) => {
    conn.connType = newType as Connection['connType'];
    // Only reset port if it's not already the default for the new type
    // or if the current port is null
    conn.port = PORT_DEFAULTS[newType];
    saveConnectionOnBlur(conn);
  };

  const handleDelete = (conn: Connection, idx: number) => {
    showConfirm('确认要删除这条连接信息吗？', () => {
      deleteConnection(conn, idx);
    });
  };

  return (
    <div>
      <div className="section-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>连接信息</span>
        {editMode && (
          <button className="button is-primary is-small" onClick={addConnection}>
            添加连接
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th style={{ width: 200 }}>名称</th>
              <th style={{ width: 100 }}>类型</th>
              <th style={{ width: 300 }}>地址</th>
              <th style={{ width: 100 }}>端口</th>
              <th>用户名</th>
              <th>密码</th>
              <th style={{ width: 150 }}>快捷连接</th>
              {editMode && <th style={{ width: 100 }}>操作</th>}
            </tr>
          </thead>
          <tbody>
            {connections.map((conn, idx) => (
              <tr key={idx}>
                {/* 名称 */}
                <td>
                  {editMode ? (
                    <input
                      className="input is-small"
                      value={conn.name}
                      onChange={e => { conn.name = e.target.value; }}
                      onBlur={() => saveConnectionOnBlur(conn)}
                    />
                  ) : (
                    conn.name || '-'
                  )}
                </td>

                {/* 类型 */}
                <td>
                  {editMode ? (
                    <div className="select is-small">
                      <select
                        value={conn.connType}
                        onChange={e => handleTypeChange(conn, e.target.value)}
                      >
                        {CONN_TYPES.map(ct => (
                          <option key={ct.value} value={ct.value}>{ct.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    conn.connType || '-'
                  )}
                </td>

                {/* 地址 */}
                <td>
                  {editMode ? (
                    <input
                      className="input is-small"
                      value={conn.address}
                      onChange={e => { conn.address = e.target.value; }}
                      onBlur={() => saveConnectionOnBlur(conn)}
                    />
                  ) : (
                    conn.address || '-'
                  )}
                </td>

                {/* 端口 */}
                <td>
                  {editMode ? (
                    <input
                      className="input is-small"
                      type="number"
                      value={conn.port ?? ''}
                      disabled={conn.connType === 'smb'}
                      onChange={e => { conn.port = e.target.value ? Number(e.target.value) : null; }}
                      onBlur={() => saveConnectionOnBlur(conn)}
                    />
                  ) : (
                    conn.port || '-'
                  )}
                </td>

                {/* 用户名 */}
                <td>
                  {editMode ? (
                    <input
                      className="input is-small"
                      value={conn.username}
                      onChange={e => { conn.username = e.target.value; }}
                      onBlur={() => saveConnectionOnBlur(conn)}
                    />
                  ) : (
                    conn.username || '-'
                  )}
                </td>

                {/* 密码 */}
                <td
                  className="password-cell"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {editMode ? (
                    <input
                      className="input is-small"
                      value={conn.password}
                      onChange={e => { conn.password = e.target.value; }}
                      onBlur={() => saveConnectionOnBlur(conn)}
                    />
                  ) : (
                    hoveredIdx === idx ? (conn.password || '-') : (conn.password ? '******' : '-')
                  )}
                </td>

                {/* 快捷连接 */}
                <td>
                  <div className="conn-actions">
                    {conn.connType === 'rdp' && (
                      <button className="button is-primary is-small" onClick={() => downloadRDP(conn)}>
                        下载RDP连接文件
                      </button>
                    )}
                    {conn.connType === 'ssh' && (
                      <button className="button is-danger is-small" onClick={() => downloadSSH(conn)}>
                        下载SSH连接文件
                      </button>
                    )}
                    {conn.connType === 'smb' && (
                      <button className="button is-warning is-small" onClick={() => downloadSMB(conn)}>
                        下载SMB连接文件
                      </button>
                    )}
                    {conn.connType === 'link' && (
                      <button className="button is-success is-small" onClick={() => openLink(conn)}>
                        打开Web链接
                      </button>
                    )}
                    {conn.connType === 'other' && <span>-</span>}
                  </div>
                </td>

                {/* 删除 */}
                {editMode && (
                  <td>
                    <button
                      className="button is-danger is-small"
                      onClick={() => handleDelete(conn, idx)}
                    >
                      删除
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
