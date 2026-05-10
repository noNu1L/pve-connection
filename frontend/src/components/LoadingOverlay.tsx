import { useApp } from '../context';

export default function LoadingOverlay() {
  const { loading } = useApp();
  if (!loading) return null;
  return (
    <div className="pve-loading">
      <div className="pve-spinner" />
      <span style={{color:'var(--text-secondary)',fontSize:13}}>加载中...</span>
    </div>
  );
}
