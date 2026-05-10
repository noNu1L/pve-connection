import { useApp } from '../context';

export default function ConfirmDialog() {
  const { confirmDialog, hideConfirm } = useApp();
  if (!confirmDialog) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={hideConfirm} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">提示</p>
        </header>
        <section className="modal-card-body">
          <p>{confirmDialog.message}</p>
        </section>
        <footer className="modal-card-foot" style={{ justifyContent: 'flex-end', gap: 8 }}>
          <button className="button" onClick={hideConfirm}>取消</button>
          <button
            className="button is-warning"
            onClick={() => { confirmDialog.onConfirm(); }}
          >
            确定
          </button>
        </footer>
      </div>
    </div>
  );
}
