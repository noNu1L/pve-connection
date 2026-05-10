import { useApp } from '../context';

export default function ExplainSection() {
  const { currentExplain, setCurrentExplain, editMode, saveExplain } = useApp();

  if (!editMode && !currentExplain) return null;

  return (
    <div>
      <div className="section-heading">说明</div>
      {editMode ? (
        <textarea
          className="textarea"
          rows={4}
          value={currentExplain}
          onChange={e => setCurrentExplain(e.target.value)}
          onBlur={() => saveExplain(currentExplain)}
          placeholder="请输入说明"
        />
      ) : (
        <div className="box" style={{ minHeight: 100, whiteSpace: 'pre-wrap', fontSize: 13 }}>
          {currentExplain}
        </div>
      )}
    </div>
  );
}
