import { useApp } from '../context';
import type { VmItem } from '../types';
import StatusTag from './StatusTag';
import ExplainSection from './ExplainSection';
import ConnectionTable from './ConnectionTable';

function parseTags(tags: string): string[] {
  if (!tags) return [];
  return tags.split(';').map(t => t.trim()).filter(Boolean);
}

export default function VmDetail() {
  const { selectedItem } = useApp();
  const vm = selectedItem as VmItem;
  if (!vm) return null;

  const vmTypeLabel = vm.type === 'qemu' ? 'KVM' : 'LXC';

  return (
    <div>
      <h3 className="title is-5">虚拟机信息</h3>
      <table className="table is-bordered is-fullwidth">
        <tbody>
          <tr>
            <th style={{ width: 120 }}>虚拟机ID</th>
            <td>{vm.vmid}</td>
            <th style={{ width: 120 }}>虚拟机名称</th>
            <td>{vm.name}</td>
          </tr>
          <tr>
            <th>节点</th>
            <td>{vm.node}</td>
            <th>类型</th>
            <td>{vmTypeLabel}</td>
          </tr>
          <tr>
            <th>状态</th>
            <td><StatusTag status={vm.status} /></td>
            <th>CPU</th>
            <td>{vm.cpus} 核</td>
          </tr>
          <tr>
            <th>CPU使用率</th>
            <td>{vm.cpuUsageFormatted}</td>
            <th>内存</th>
            <td>{vm.memFormatted} / {vm.maxmemFormatted} GB</td>
          </tr>
          <tr>
            <th>磁盘</th>
            <td>{vm.diskFormatted} / {vm.maxdiskFormatted} GB</td>
            <th>运行时长</th>
            <td>{vm.uptimeFormatted}</td>
          </tr>
          <tr>
            <th>标签</th>
            <td colSpan={3}>
              {parseTags(vm.tags).length > 0 ? (
                <div className="tags">
                  {parseTags(vm.tags).map((tag, i) => (
                    <span key={i} className="tag is-info">{tag}</span>
                  ))}
                </div>
              ) : '-'}
            </td>
          </tr>
          <tr>
            <th>备注</th>
            <td colSpan={3}>{vm.description || '-'}</td>
          </tr>
        </tbody>
      </table>

      <ExplainSection />
      <ConnectionTable />
    </div>
  );
}
