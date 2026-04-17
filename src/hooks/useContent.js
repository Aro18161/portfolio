import { useState, useEffect } from 'react';
import { store } from '../data/store';

/**
 * Fetch a content collection from Supabase.
 * Returns { data, loading, reload }
 */
export function useContent(key) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    store.get(key).then((result) => {
      setData(result);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, reload: load };
}
