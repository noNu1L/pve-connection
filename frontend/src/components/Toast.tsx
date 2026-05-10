import { useApp } from '../context';

const ICONS: Record<string, string> = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className={`pve-toast ${toast.type}`}>
      <span className="pve-toast-icon">{ICONS[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  );
}
