import { ArrowRight } from 'lucide-react';

import { Badge, Card } from '@/components/ui';
import type { HomeContentItem } from '@/features/home/model/home';

interface ContentSectionProps {
  title: string;
  items: HomeContentItem[];
}

export function ContentSection({ title, items }: ContentSectionProps) {
  return (
    <section aria-labelledby={`section-${items[0]?.id ?? title}`}>
      <div className='mb-3 flex items-center justify-between'>
        <h2 id={`section-${items[0]?.id ?? title}`} className='text-lg font-bold text-gray-950'>{title}</h2>
        <ArrowRight aria-hidden='true' className='size-4 text-gray-400' />
      </div>
      <div className='space-y-3'>
        {items.map((item) => (
          <Card key={item.id} className='shadow-none'>
            <Badge variant='primary'>{item.category}</Badge>
            <h3 className='mt-3 font-semibold leading-6 text-gray-950'>{item.title}</h3>
            <p className='mt-1 text-sm leading-5 text-gray-500'>{item.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
