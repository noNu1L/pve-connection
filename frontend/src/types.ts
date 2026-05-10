// === /api/data ===

export interface StorageItem {
  storage: string;
  type: string;
  content: string;
  status: string;
  used: number;
  total: number;
  avail: number;
  active: number;
  usedFormatted: string;
  totalFormatted: string;
  availFormatted: string;
  usageFormatted: string;
}

export interface HostItem {
  node: string;
  status: string;
  cpus: number;
  maxmem: number;
  maxdisk: number;
  mem: number;
  disk: number;
  uptime: number;
  cpuUsage: number;
  description: string;
  type: 'host';
  storages: StorageItem[];
  // formatted
  memFormatted: string;
  maxmemFormatted: string;
  memUsageFormatted: string;
  diskFormatted: string;
  maxdiskFormatted: string;
  cpuUsageFormatted: string;
  uptimeFormatted: string;
}

export interface VmItem {
  vmid: number;
  node: string;
  name: string;
  type: 'qemu' | 'lxc';
  status: string;
  cpus: number;
  maxmem: number;
  maxdisk: number;
  mem: number;
  disk: number;
  uptime: number;
  cpuUsage: number;
  tags: string;
  description: string;
  // formatted
  memFormatted: string;
  maxmemFormatted: string;
  memUsageFormatted: string;
  diskFormatted: string;
  maxdiskFormatted: string;
  cpuUsageFormatted: string;
  uptimeFormatted: string;
}

export type AllItem = HostItem | VmItem;

export interface DataResponse {
  hosts: HostItem[] | null;
  vms: VmItem[] | null;
  error: string | null;
}

// === Connections ===

export interface HostConnection {
  id: number | null;
  node: string;
  connType: 'rdp' | 'ssh' | 'smb' | 'link' | 'other';
  name: string;
  address: string;
  port: number | null;
  username: string;
  password: string;
}

export interface VmConnection {
  id: number | null;
  vmid: number;
  connType: 'rdp' | 'ssh' | 'smb' | 'link' | 'other';
  name: string;
  address: string;
  port: number | null;
  username: string;
  password: string;
}

export type Connection = HostConnection | VmConnection;

export interface ConnectionSaveResponse {
  success: boolean;
  id?: number;
  data?: HostConnection | VmConnection;
  error?: string;
}

// === Explain ===

export interface ExplainResponse {
  explain: string;
  error?: string;
}

// === Config ===

export interface ConfigData {
  pve_ip: string;
  pve_port: string;
  pve_username: string;
  pve_password: string;
  menu_show_description: string;
  first_run: string;
}

export interface ConfigResponse {
  success: boolean;
  data?: ConfigData;
  message?: string;
  error?: string;
}

export interface FirstRunResponse {
  success: boolean;
  firstRun: boolean;
  error?: string;
}

export interface MenuShowDescriptionResponse {
  success: boolean;
  showDescription: boolean;
  error?: string;
}

// === App State ===

export type EditMode = boolean;

export interface AppSettings {
  pve_ip: string;
  pve_port: string;
  pve_username: string;
  pve_password: string;
  menu_show_description_bool: boolean;
}
