import type {
  DataResponse,
  ExplainResponse,
  HostConnection,
  VmConnection,
  ConnectionSaveResponse,
  ConfigResponse,
  FirstRunResponse,
  MenuShowDescriptionResponse,
  ConfigData,
} from './types';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// Data
export function fetchData(): Promise<DataResponse> {
  return request<DataResponse>('/api/data');
}

// Explain
export function fetchExplain(id: string | number, type: 'host' | 'vm'): Promise<ExplainResponse> {
  const path = type === 'host' ? `/api/host/${id}/explain` : `/api/vm/${id}/explain`;
  return request<ExplainResponse>(path);
}

export function saveExplain(id: string | number, type: 'host' | 'vm', explain: string): Promise<{ success: boolean }> {
  const path = type === 'host' ? `/api/host/${id}/explain` : `/api/vm/${id}/explain`;
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ explain }),
  });
}

// Connections
export function fetchHostConnections(node: string): Promise<HostConnection[]> {
  return request<HostConnection[]>(`/api/host/${node}/connections`);
}

export function fetchVmConnections(vmid: number): Promise<VmConnection[]> {
  return request<VmConnection[]>(`/api/vm/${vmid}/connections`);
}

export function saveHostConnection(node: string, conn: Partial<HostConnection>): Promise<ConnectionSaveResponse> {
  return request<ConnectionSaveResponse>(`/api/host/${node}/connections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(conn),
  });
}

export function saveVmConnection(vmid: number, conn: Partial<VmConnection>): Promise<ConnectionSaveResponse> {
  return request<ConnectionSaveResponse>(`/api/vm/${vmid}/connections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(conn),
  });
}

export function deleteHostConnection(id: number): Promise<void> {
  return fetch(`/api/host/connections/${id}`, { method: 'DELETE' }).then(() => undefined);
}

export function deleteVmConnection(id: number): Promise<void> {
  return fetch(`/api/connections/${id}`, { method: 'DELETE' }).then(() => undefined);
}

// Config
export function fetchConfig(): Promise<ConfigResponse> {
  return request<ConfigResponse>('/api/config');
}

export function saveConfig(data: ConfigData): Promise<ConfigResponse> {
  return request<ConfigResponse>('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function fetchFirstRun(): Promise<FirstRunResponse> {
  return request<FirstRunResponse>('/api/config/first-run');
}

export function fetchMenuShowDescription(): Promise<MenuShowDescriptionResponse> {
  return request<MenuShowDescriptionResponse>('/api/config/menu-show-description');
}
