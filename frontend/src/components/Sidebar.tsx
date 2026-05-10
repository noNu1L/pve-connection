import { useApp } from '../context';
import type { HostItem, VmItem } from '../types';
import StatusTag from './StatusTag';

export default function Sidebar() {
  const { hosts, vms, activeTab, showDescription, selectItem } = useApp();

  return (
    <nav style={{ paddingTop: 8, paddingBottom: 16 }}>
      {hosts.length > 0 && (
        <>
          <div className="sidebar-section-label">宿主机</div>
          {hosts.map(item => {
            const key = `host-${(item as HostItem).node}`;
            return (
              <div
                key={key}
                className={`sidebar-item ${activeTab === key ? 'active' : ''}`}
                onClick={() => selectItem(key)}
              >
                <div className="sidebar-item-inner">
                  <div className="sidebar-item-row">
                    <span className="sidebar-item-name">{(item as HostItem).node}</span>
                    <StatusTag status={item.status} showText={false} />
                  </div>
                  {showDescription && item.description && (
                    <div className="sidebar-item-desc">{item.description}</div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {vms.length > 0 && (
        <>
          <div className="sidebar-section-label" style={{ marginTop: hosts.length > 0 ? 8 : 0 }}>虚拟机</div>
          {vms.map(item => {
            const vm = item as VmItem;
            const key = String(vm.vmid);
            return (
              <div
                key={key}
                className={`sidebar-item ${activeTab === key ? 'active' : ''}`}
                onClick={() => selectItem(key)}
              >
                <div className="sidebar-item-inner">
                  <div className="sidebar-item-row">
                    <span className="sidebar-item-name">{vm.name}</span>
                    <StatusTag status={vm.status} showText={false} />
                  </div>
                  {showDescription && vm.description && (
                    <div className="sidebar-item-desc">{vm.description}</div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </nav>
  );
}
