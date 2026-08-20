'use client';

import { MapPinned } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { ItineraryItem } from '@/features/trip/model/trip';

interface KakaoMapProps {
  items: ItineraryItem[];
}

export function KakaoMap({ items }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined' || !window.kakao?.maps || items.length === 0) return;

    window.kakao.maps.load(() => {
      if (!mapRef.current) return;
      const first = items[0];
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(first.latitude, first.longitude),
        level: 6,
      });
      const bounds = new window.kakao.maps.LatLngBounds();
      items.forEach((item) => {
        const position = new window.kakao.maps.LatLng(item.latitude, item.longitude);
        new window.kakao.maps.Marker({ map, position, title: item.name });
        bounds.extend(position);
      });
      map.setBounds(bounds);
      setSdkReady(true);
    });
  }, [items]);

  return (
    <section aria-label='일정 지도'>
      <div ref={mapRef} className='relative h-56 overflow-hidden rounded-2xl bg-violet-50'>
        {!sdkReady ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-violet-700'>
            <MapPinned aria-hidden='true' size={32} />
            <p className='mt-3 text-sm font-semibold'>Kakao Map 영역</p>
            <p className='mt-1 text-xs leading-5 text-gray-500'>SDK 로더 연결 전에는 아래 장소 목록으로 일정을 확인할 수 있어요.</p>
          </div>
        ) : null}
      </div>
      <ol aria-label='지도에 표시된 장소' className='mt-3 flex gap-2 overflow-x-auto pb-1'>
        {items.map((item, index) => (
          <li key={item.id} className='shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700'>{index + 1}. {item.name}</li>
        ))}
      </ol>
      {/* TODO: 백엔드 장소 좌표 계약과 Kakao SDK 로딩 정책 확정 후 공통 loader로 이동 */}
    </section>
  );
}
