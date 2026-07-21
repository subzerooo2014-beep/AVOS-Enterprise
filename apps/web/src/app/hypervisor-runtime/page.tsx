import { HypervisorConsole } from '../../components/hypervisor-distributed-runtime/hypervisor-console';
import './hypervisor-runtime.css';

export const metadata = {
  title: 'AVOS Hypervisor & Distributed Runtime',
  description:
    'Enterprise distributed runtime orchestration and operations console.',
};

export default function HypervisorRuntimePage() {
  return <HypervisorConsole />;
}