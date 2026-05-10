import { useApp } from '../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { editMode, toggleEditMode, setSettingsDialogVisible } = useApp();

  return (
    <header className="app-header">
      <div className="app-title">
        PVE <span>Connection</span>
      </div>
      <button
        className="header-btn"
        title="设置"
        onClick={() => setSettingsDialogVisible(true)}
      >
        <FontAwesomeIcon icon={faGear} />
      </button>
      <button
        className={`header-btn ${editMode ? 'active' : ''}`}
        title={editMode ? '退出编辑模式' : '进入编辑模式'}
        onClick={toggleEditMode}
      >
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
    </header>
  );
}
