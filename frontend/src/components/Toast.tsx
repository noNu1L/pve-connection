import { useApp } from '../context';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const bgMap = {
    success: 'is-success',
    error: 'is-danger',
    warning: 'is-warning',
    info: 'is-info',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      minWidth: 250,
    }}>
      <div className={`notification ${bgMap[toast.type]} py-3 px-4`} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        {toast.message}
      </div>
    </div>
  );
}
