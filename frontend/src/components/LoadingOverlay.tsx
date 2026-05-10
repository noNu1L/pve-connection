import { useApp } from '../context';

export default function LoadingOverlay() {
  const { loading } = useApp();
  if (!loading) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9998,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="box has-text-centered">
        <p className="is-size-5 mb-3">加载中...</p>
        <progress className="progress is-small is-primary" max="100" style={{ width: 200 }} />
      </div>
    </div>
  );
}
