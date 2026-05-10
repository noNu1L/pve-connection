interface Props {
  status: string;
  showText?: boolean;
}

const RUNNING = new Set(['running', 'online', 'active', 'available']);
const STOPPED = new Set(['stopped', 'inactive']);

export default function StatusTag({ status, showText = true }: Props) {
  const cls = RUNNING.has(status) ? status : STOPPED.has(status) ? 'stopped' : 'error';
  return (
    <span className={`status-dot ${cls}`}>
      <span className="status-dot-circle" />
      {showText && <span className="status-dot-text">{status}</span>}
    </span>
  );
}
