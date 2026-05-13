import { useApp } from '../context';
import type { VmItem } from '../types';
import StatusTag from './StatusTag';
import DescriptionBox from './DescriptionBox';
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

  const tags = parseTags(vm.tags);

  return (
    <div>
      <div className="detail-header">
        <div>
          <h1 className="detail-title">{vm.name}</h1>
          <div className="detail-subtitle">
            #{vm.vmid} · {vm.type === 'qemu' ? 'KVM' : 'LXC'} · {vm.node}
          </div>
        </div>
        <StatusTag status={vm.status} />
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">CPU</div>
          <div className="stat-value">{vm.cpus}</div>
          <div className="stat-sub">使用率 {vm.cpuUsageFormatted}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">内存</div>
          <div className="stat-value">{vm.memFormatted} <span style={{fontSize:13,color:'var(--text-muted)'}}>GB</span></div>
          <div className="stat-sub">/ {vm.maxmemFormatted} GB · {vm.memUsageFormatted}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">磁盘</div>
          <div className="stat-value">{vm.diskFormatted} <span style={{fontSize:13,color:'var(--text-muted)'}}>GB</span></div>
          <div className="stat-sub">/ {vm.maxdiskFormatted} GB</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">运行时长</div>
          <div className="stat-value" style={{fontSize:15, fontFamily:'var(--font-body)'}}>{vm.uptimeFormatted}</div>
        </div>
        {tags.length > 0 && (
          <div className="stat-card">
            <div className="stat-label">标签</div>
            <div style={{display:'flex', gap:5, flexWrap:'wrap', marginTop:4}}>
              {tags.map((t, i) => <span key={i} className="pve-tag info">{t}</span>)}
            </div>
          </div>
        )}
      </div>

      {vm.description && <DescriptionBox text={vm.description} />}

      <ExplainSection />
      <ConnectionTable />
    </div>
  );
}
