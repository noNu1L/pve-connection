import { useApp } from '../context';
import HostDetail from './HostDetail';
import VmDetail from './VmDetail';

export default function DetailPanel() {
  const { selectedItem } = useApp();
  if (!selectedItem) return null;
  return selectedItem.type === 'host' ? <HostDetail /> : <VmDetail />;
}
