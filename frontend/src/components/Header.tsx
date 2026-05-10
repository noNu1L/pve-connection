import { useApp } from '../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { editMode, toggleEditMode, setSettingsDialogVisible } = useApp();

  return (
    <nav className="navbar is-white" style={{ borderBottom: '1px solid #e4e7ed' }}>
      <div className="navbar-brand">
        <span className="navbar-item is-size-5 has-text-weight-medium">
          Proxmox VE 虚拟机应用信息
        </span>
      </div>
      <div className="navbar-menu is-active">
        <div className="navbar-end">
          <div className="navbar-item">
            <button
              className="button is-white"
              title="设置"
              onClick={() => setSettingsDialogVisible(true)}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faGear} />
              </span>
            </button>
          </div>
          <div className="navbar-item">
            <button
              className={`button ${editMode ? 'is-success' : 'is-white'}`}
              title="编辑模式"
              onClick={toggleEditMode}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faPenToSquare} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
