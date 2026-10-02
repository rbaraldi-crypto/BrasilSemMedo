import { useSearchParams } from 'react-router-dom';
import { P7CommandCenter } from '@/components/intelligence/P7CommandCenter';

export default function P7Page() {
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  return (
    <div
      className="w-full"
      style={{ height: 'calc(100vh - 7rem)' }}
    >
      <P7CommandCenter initialView={initialView} />
    </div>
  );
}
