import React, { useState } from 'react';
import {
  useGetDestinationsQuery,
  useAddDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} from '../services/api';

const DestinationCrudExample = () => {
  const { data, error, isLoading, refetch } = useGetDestinationsQuery();
  const [addDestination] = useAddDestinationMutation();
  const [updateDestination] = useUpdateDestinationMutation();
  const [deleteDestination] = useDeleteDestinationMutation();

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleAdd = async () => {
    await addDestination({ name: newName, description: newDesc });
    setNewName('');
    setNewDesc('');
    refetch();
  };

  const handleUpdate = async (id: number) => {
    await updateDestination({ id, data: { name: editName, description: editDesc } });
    setEditId(null);
    setEditName('');
    setEditDesc('');
    refetch();
  };

  const handleDelete = async (id: number) => {
    await deleteDestination(id);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <div>
      <h2>Destinations</h2>
      <ul>
        {data?.map((dest: any) => (
          <li key={dest.id}>
            {editId === dest.id ? (
              <>
                <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" />
                <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description" />
                <button onClick={() => handleUpdate(dest.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <b>{dest.name}</b>: {dest.description}
                <button onClick={() => { setEditId(dest.id); setEditName(dest.name); setEditDesc(dest.description); }}>Edit</button>
                <button onClick={() => handleDelete(dest.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h3>Add Destination</h3>
      <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" />
      <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default DestinationCrudExample; 