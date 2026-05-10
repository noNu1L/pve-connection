import type { StorageItem } from '../types';

interface Props { storages: StorageItem[]; }

export default function StorageTable({ storages }: Props) {
  return (
    <div className="table-wrapper" style={{marginBottom: 8}}>
      <table className="pve-table">
        <thead>
          <tr>
            <th style={{width:'18%'}}>存储名称</th>
            <th style={{width:'8%'}}>类型</th>
            <th style={{width:'22%'}}>内容类型</th>
            <th style={{width:'10%'}}>状态</th>
            <th style={{width:'10%'}}>已使用</th>
            <th style={{width:'10%'}}>总容量</th>
            <th style={{width:'10%'}}>可用</th>
            <th style={{width:'12%'}}>使用率</th>
          </tr>
        </thead>
        <tbody>
          {storages.map((s, i) => (
            <tr key={i}>
              <td style={{fontWeight:500}}>{s.storage}</td>
              <td className="mono">{s.type}</td>
              <td className="mono" style={{fontSize:11}}>{s.content}</td>
              <td>
                <span className={`status-dot ${s.active === 1 ? 'active' : 'stopped'}`}>
                  <span className="status-dot-circle" />
                  <span className="status-dot-text">{s.active === 1 ? '活动' : '非活动'}</span>
                </span>
              </td>
              <td className="mono">{s.usedFormatted} GB</td>
              <td className="mono">{s.totalFormatted} GB</td>
              <td className="mono">{s.availFormatted} GB</td>
              <td className="mono">{s.usageFormatted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
