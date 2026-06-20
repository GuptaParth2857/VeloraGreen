'use client';

import { useEffect } from 'react';

export function useSEO(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | EcoTrace`;

    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.getAttribute('content');

    if (description && metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    return () => {
      document.title = previousTitle;
      if (description && originalDescription && metaDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
    };
  }, [title, description]);
}
