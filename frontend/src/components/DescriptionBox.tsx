import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const COLLAPSED_HEIGHT = 120;

export default function DescriptionBox({ text, label = '备注' }: { text: string; label?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) setOverflows(ref.current.scrollHeight > COLLAPSED_HEIGHT);
    setExpanded(false);
  }, [text]);

  return (
    <div>
      <div className="section-heading">{label}</div>
      <div
        ref={ref}
        className="explain-box"
        style={{
          maxHeight: expanded || !overflows ? 'none' : COLLAPSED_HEIGHT,
          overflow: 'hidden',
          position: 'relative',
          borderRadius: overflows ? 'var(--radius) var(--radius) 0 0' : 'var(--radius)',
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        {overflows && !expanded && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
            background: 'linear-gradient(transparent, var(--bg-surface))',
            pointerEvents: 'none',
          }} />
        )}
      </div>
      {overflows && (
        <button className="explain-toggle" onClick={() => setExpanded(v => !v)}>
          {expanded ? '收起 ↑' : '展开 ↓'}
        </button>
      )}
    </div>
  );
}
