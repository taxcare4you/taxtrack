'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Category = {
  id: string;
  name: string;
  is_active: boolean;
};

export default function EditableCategoryList({
  categories,
  refresh,
}: {
  categories: Category[];
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

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setNewName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewName('');
  };

  const saveEdit = async () => {
    if (!editingId || !userId) return;
    const { error } = await supabase
      .from('category')
      .update({ name: newName })
      .eq('id', editingId)
      .eq('user_id', userId); // ✅ Scoped update
    if (!error) {
      cancelEdit();
      refresh();
    }
  };

  const toggleActive = async (cat: Category) => {
    if (!userId) return;
    const { error } = await supabase
      .from('category')
      .update({ is_active: !cat.is_active })
      .eq('id', cat.id)
      .eq('user_id', userId); // ✅ Scoped update
    if (!error) refresh();
  };

  return (
    <ul>
      {categories.map((cat) => (
        <li key={cat.id} style={{ marginBottom: '0.5rem' }}>
          {editingId === cat.id ? (
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
              <span style={{ textDecoration: cat.is_active ? 'none' : 'line-through' }}>
                {cat.name}
              </span>
              <button onClick={() => startEdit(cat)} style={{ marginLeft: '0.5rem' }}>
                Edit
              </button>
              <button onClick={() => toggleActive(cat)} style={{ marginLeft: '0.5rem' }}>
                {cat.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}