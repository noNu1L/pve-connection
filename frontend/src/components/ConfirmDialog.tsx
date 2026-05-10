import { useApp } from '../context';

export default function ConfirmDialog() {
  const { confirmDialog, hideConfirm } = useApp();
  if (!confirmDialog) return null;

  return (
    <div className="pve-modal-bg" onClick={hideConfirm}>
      <div className="pve-modal" style={{maxWidth:400}} onClick={e => e.stopPropagation()}>
        <div className="pve-modal-head">
          <span className="pve-modal-title">确认操作</span>
          <button className="pve-modal-close" onClick={hideConfirm}>✕</button>
        </div>
        <div className="pve-modal-body">
          <p style={{color:'var(--text-secondary)',fontSize:14}}>{confirmDialog.message}</p>
        </div>
        <div className="pve-modal-foot">
          <button className="btn btn-ghost" onClick={hideConfirm}>取消</button>
          <button className="btn btn-warning" onClick={() => { confirmDialog.onConfirm(); }}>确定</button>
        </div>
      </div>
    </div>
  );
}
