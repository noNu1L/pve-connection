import { useApp } from '../context';
import type { HostItem } from '../types';
import StatusTag from './StatusTag';
import StorageTable from './StorageTable';
import ExplainSection from './ExplainSection';
import ConnectionTable from './ConnectionTable';

export default function HostDetail() {
  const { selectedItem } = useApp();
  const host = selectedItem as HostItem;
  if (!host || host.type !== 'host') return null;

  return (
    <div>
      <h3 className="title is-5">宿主机信息</h3>
      <table className="table is-bordered is-fullwidth">
        <tbody>
          <tr>
            <th style={{ width: 120 }}>节点名称</th>
            <td>{host.node}</td>
            <th style={{ width: 120 }}>状态</th>
            <td><StatusTag status={host.status} /></td>
          </tr>
          <tr>
            <th>CPU核心数</th>
            <td>{host.cpus} 核</td>
            <th>CPU使用率</th>
            <td>{host.cpuUsageFormatted}</td>
          </tr>
          <tr>
            <th>内存使用</th>
            <td>{host.memFormatted} / {host.maxmemFormatted} GB</td>
            <th>内存使用率</th>
            <td>{host.memUsageFormatted}</td>
          </tr>
          <tr>
            <th>运行时长</th>
            <td colSpan={3}>{host.uptimeFormatted}</td>
          </tr>
          <tr>
            <th>备注</th>
            <td colSpan={3}>{host.description || '-'}</td>
          </tr>
        </tbody>
      </table>

      <h4 className="section-heading">存储信息</h4>
      <StorageTable storages={host.storages} />

      <ExplainSection />
      <ConnectionTable />
    </div>
  );
}
