import type { StorageItem } from '../types';

interface Props {
  storages: StorageItem[];
}

export default function StorageTable({ storages }: Props) {
  return (
    <div className="table-wrapper">
      <table className="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>存储名称</th>
            <th>类型</th>
            <th>内容类型</th>
            <th>状态</th>
            <th>已使用</th>
            <th>总容量</th>
            <th>可用</th>
            <th>使用率</th>
          </tr>
        </thead>
        <tbody>
          {storages.map((s, i) => (
            <tr key={i}>
              <td>{s.storage}</td>
              <td>{s.type}</td>
              <td>{s.content}</td>
              <td>
                <span className={`tag ${s.active === 1 ? 'is-success' : 'is-info'}`}>
                  {s.active === 1 ? '活动' : '非活动'}
                </span>
              </td>
              <td>{s.usedFormatted} GB</td>
              <td>{s.totalFormatted} GB</td>
              <td>{s.availFormatted} GB</td>
              <td>{s.usageFormatted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
