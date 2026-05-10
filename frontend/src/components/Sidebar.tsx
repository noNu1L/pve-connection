import { useApp } from '../context';
import type { AllItem, HostItem, VmItem } from '../types';
import StatusTag from './StatusTag';

function getItemKey(item: AllItem): string {
  return item.type === 'host' ? `host-${item.node}` : String(item.vmid);
}

function getItemTitle(item: AllItem): string {
  return item.type === 'host' ? item.node : item.name;
}

function getItemStatus(item: AllItem): string {
  if (item.type === 'host') return item.status;
  return item.status;
}

export default function Sidebar() {
  const { hosts, vms, allItems, activeTab, showDescription, selectItem } = useApp();

  return (
    <aside className="menu px-0" style={{ overflowY: 'auto' }}>
      {hosts.length > 0 && (
        <>
          <p className="menu-label" style={{ paddingLeft: 12 }}>宿主机</p>
          <ul className="menu-list">
            {hosts.map(item => (
              <li key={`host-${(item as HostItem).node}`}>
                <a
                  className={activeTab === `host-${(item as HostItem).node}` ? 'is-active' : ''}
                  onClick={() => selectItem(`host-${(item as HostItem).node}`)}
                  style={{ padding: '8px 12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span className="has-text-weight-medium">{(item as HostItem).node}</span>
                    <StatusTag status={item.status} />
                  </div>
                  {showDescription && item.description && (
                    <div className="is-size-7 mt-1" style={{ color: '#909399' }}>
                      {item.description}
                    </div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {vms.length > 0 && (
        <>
          <p className="menu-label" style={{ paddingLeft: 12 }}>虚拟机</p>
          <ul className="menu-list">
            {vms.map(item => (
              <li key={String((item as VmItem).vmid)}>
                <a
                  className={activeTab === String((item as VmItem).vmid) ? 'is-active' : ''}
                  onClick={() => selectItem(String((item as VmItem).vmid))}
                  style={{ padding: '8px 12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span className="has-text-weight-medium">{item.name}</span>
                    <StatusTag status={item.status} />
                  </div>
                  {showDescription && item.description && (
                    <div className="is-size-7 mt-1" style={{ color: '#909399' }}>
                      {item.description}
                    </div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
