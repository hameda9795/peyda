'use client';

import { useEffect } from 'react';
import { trackBusinessView } from '@/lib/tracking';
import { Business } from '@/lib/types';

export function TrackPageView({ business }: { business: Business }) {
  useEffect(() => {
    if (business.id) {
      trackBusinessView(business.id);
    }
  }, [business.id]);

  return null;
}
