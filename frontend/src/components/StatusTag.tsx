interface Props {
  status: string;
}

const RUNNING = new Set(['running', 'online', 'active', 'available']);

export default function StatusTag({ status }: Props) {
  if (RUNNING.has(status)) {
    return <span className="tag is-success">{status}</span>;
  }
  if (status === 'stopped' || status === 'inactive') {
    return <span className="tag is-info">{status}</span>;
  }
  return <span className="tag is-danger">{status}</span>;
}
