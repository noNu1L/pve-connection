import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useApp } from '../context';

const COLLAPSED_HEIGHT = 120;

export default function ExplainSection() {
  const { currentExplain, setCurrentExplain, editMode, saveExplain } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setOverflows(contentRef.current.scrollHeight > COLLAPSED_HEIGHT);
    }
    setExpanded(false);
  }, [currentExplain]);

  if (!editMode && !currentExplain) return null;

  return (
    <div>
      <div className="section-heading">说明</div>
      {editMode ? (
        <textarea
          className="pve-textarea"
          rows={4}
          value={currentExplain}
          onChange={e => setCurrentExplain(e.target.value)}
          onBlur={() => saveExplain(currentExplain)}
          placeholder="请输入说明..."
        />
      ) : (
        <div>
          <div
            ref={contentRef}
            className="explain-box"
            style={{
              maxHeight: expanded || !overflows ? 'none' : COLLAPSED_HEIGHT,
              overflow: 'hidden',
              position: 'relative',
              borderRadius: overflows ? 'var(--radius) var(--radius) 0 0' : 'var(--radius)',
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentExplain}</ReactMarkdown>
            {overflows && !expanded && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 36,
                background: 'linear-gradient(transparent, var(--bg-surface))',
                pointerEvents: 'none',
              }} />
            )}
          </div>
          {overflows && (
            <button
              className="explain-toggle"
              onClick={() => setExpanded(v => !v)}
            >
              {expanded ? '收起 ↑' : '展开 ↓'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
