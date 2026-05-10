import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context';
import type { HostItem } from '../types';
import StatusTag from './StatusTag';
import StorageTable from './StorageTable';
import ExplainSection from './ExplainSection';
import ConnectionTable from './ConnectionTable';

const COLLAPSED_HEIGHT = 120;

function DescriptionBox({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) setOverflows(ref.current.scrollHeight > COLLAPSED_HEIGHT);
    setExpanded(false);
  }, [text]);

  return (
    <div>
      <div className="section-heading">备注</div>
      <div
        ref={ref}
        className="explain-box"
        style={{
          maxHeight: expanded || !overflows ? 'none' : COLLAPSED_HEIGHT,
          overflow: 'hidden',
          position: 'relative',
          borderRadius: overflows ? 'var(--radius) var(--radius) 0 0' : 'var(--radius)',
        }}
      >
        {text}
        {overflows && !expanded && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
            background: 'linear-gradient(transparent, var(--bg-surface))',
            pointerEvents: 'none',
          }} />
        )}
      </div>
      {overflows && (
        <button className="explain-toggle" onClick={() => setExpanded(v => !v)}>
          {expanded ? '收起 ↑' : '展开 ↓'}
        </button>
      )}
    </div>
  );
}

export default function HostDetail() {
  const { selectedItem } = useApp();
  const host = selectedItem as HostItem;
  if (!host || host.type !== 'host') return null;

  return (
    <div>
      <div className="detail-header">
        <div>
          <h1 className="detail-title">{host.node}</h1>
          <div className="detail-subtitle">宿主机节点</div>
        </div>
        <StatusTag status={host.status} />
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">CPU 核心</div>
          <div className="stat-value">{host.cpus}</div>
          <div className="stat-sub">使用率 {host.cpuUsageFormatted}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">内存</div>
          <div className="stat-value">{host.memFormatted} <span style={{fontSize:13,color:'var(--text-muted)'}}>GB</span></div>
          <div className="stat-sub">/ {host.maxmemFormatted} GB · {host.memUsageFormatted}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">运行时长</div>
          <div className="stat-value" style={{fontSize:15, fontFamily:'var(--font-body)'}}>{host.uptimeFormatted}</div>
        </div>
      </div>

      {host.description && <DescriptionBox text={host.description} />}

      <div className="section-heading">存储信息</div>
      <StorageTable storages={host.storages} />

      <ExplainSection />
      <ConnectionTable />
    </div>
  );
}
