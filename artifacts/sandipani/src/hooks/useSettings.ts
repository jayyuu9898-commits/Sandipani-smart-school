import { useState, useEffect } from 'react';
import { supabase, SchoolSettings } from '@/lib/supabase';

const SETTINGS_KEY = 'school_settings';

export function useSchoolSettings() {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from(SETTINGS_KEY)
        .select('*')
        .limit(1)
        .single();

      if (fetchError) throw fetchError;
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<SchoolSettings>) => {
    if (!settings) return false;

    try {
      const { error: updateError } = await supabase
        .from(SETTINGS_KEY)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);

      if (updateError) throw updateError;

      setSettings({ ...settings, ...updates, updated_at: new Date().toISOString() });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      return false;
    }
  };

  return { settings, loading, error, updateSettings, refetch: fetchSettings };
}
