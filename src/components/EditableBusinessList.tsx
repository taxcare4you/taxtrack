'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Business = {
  id: string;
  name: string;
  is_active: boolean;
};

export default function EditableBusinessList({
  businesses,
  refresh,
}: {
  businesses: Business[];
  refresh: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSessionUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSessionUser();
  }, []);

  const startEdit = (biz: Business) => {
    setEditingId(biz.id);
    setNewName(biz.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewName('');
  };

  const saveEdit = async () => {
    if (!editingId || !userId) return;
    const { error } = await supabase
      .from('business')
      .update({ name: newName })
      .eq('id', editingId)
      .eq('user_id', userId); // ✅ Scoped update
    if (!error) {
      cancelEdit();
      refresh();
    }
  };

  const toggleActive = async (biz: Business) => {
    if (!userId) return;
    const { error } = await supabase
      .from('business')
      .update({ is_active: !biz.is_active })
      .eq('id', biz.id)
      .eq('user_id', userId); // ✅ Scoped update
    if (!error) refresh();
  };

  return (
    <ul>
      {businesses.map((biz) => (
        <li key={biz.id} style={{ marginBottom: '0.5rem' }}>
          {editingId === biz.id ? (
            <>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              <button onClick={saveEdit}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <span style={{ textDecoration: biz.is_active ? 'none' : 'line-through' }}>
                {biz.name}
              </span>
              <button onClick={() => startEdit(biz)} style={{ marginLeft: '0.5rem' }}>
                Edit
              </button>
              <button onClick={() => toggleActive(biz)} style={{ marginLeft: '0.5rem' }}>
                {biz.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}