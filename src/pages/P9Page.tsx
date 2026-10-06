import { useSearchParams } from 'react-router-dom';
import { P9CommandCenter } from '@/components/intelligence/P9CommandCenter';

export default function P9Page() {
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  return (
    <div className="w-full" style={{ height: 'calc(100vh - 7rem)' }}>
      <P9CommandCenter initialView={initialView} />
    </div>
  );
}
