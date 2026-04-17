import { supabase } from '../lib/supabase';
import { engineeringProjects, blogPosts } from './engineering';
import { designProjects, essays, articles } from './design';
import { companies } from './company';

export const DEFAULTS = {
  engineeringProjects,
  blogPosts,
  designProjects,
  essays,
  articles,
  companies,
};

export const store = {
  /** Fetch a collection. Falls back to JS defaults if row not found. */
  async get(key) {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('data')
        .eq('collection', key)
        .maybeSingle();

      if (error) throw error;
      return data ? data.data : DEFAULTS[key];
    } catch (err) {
      console.error('[store.get]', key, err);
      return DEFAULTS[key];
    }
  },

  /** Upsert a collection. */
  async set(key, items) {
    const { error } = await supabase
      .from('content')
      .upsert(
        { collection: key, data: items, updated_at: new Date().toISOString() },
        { onConflict: 'collection' }
      );

    if (error) throw error;
  },

  /** Delete a single collection row (reverts to default on next read). */
  async reset(key) {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('collection', key);

    if (error) throw error;
  },

  /** Delete all collection rows. */
  async resetAll() {
    const { error } = await supabase
      .from('content')
      .delete()
      .in('collection', Object.keys(DEFAULTS));

    if (error) throw error;
  },

  keys: Object.keys(DEFAULTS),
  defaults: DEFAULTS,
};
