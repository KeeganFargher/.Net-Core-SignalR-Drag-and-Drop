import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Quote from './Quote';

import useSignalR from './useSignalR';

const initial = Array.from({ length: 10 }, (v, k) => k).map((k) => {
  const custom = {
    id: `id-${k}`,
    content: `${k}`
  };
  return custom;
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function Home() {
  const [quotes, setQuotes] = useState(initial);
  const [userCount, setUserCount] = useState(null);

  const [connection, error] = useSignalR('/DragAndDrop');

  useEffect(() => {
    if (connection && !connection.connectionStarted) {
      connection.on('ReceiveTotalUserCount', (result) => setUserCount(result));
      connection.on('ReceiveQuoteAdded', (result) => setQuotes((q) => [...q, result]));
      connection.on('ReceivePositionMoved', (result) =>
        setQuotes((q) => reorder(q, result.source.index, result.destination.index))
      );
      connection.on('ReceiveQuoteDeleted', (result) =>
        setQuotes((q) => {
          return [...q].filter((x) => x.id !== result);
        })
      );
    }
  }, [connection]);

  async function addItem() {
    const id = quotes.length === 0 ? 0 : (Math.max(...quotes.flatMap((x) => x.content)) + 1).toString();
    const item = { id: id, content: id };
    setQuotes([...quotes, item]);

    await connection.send('SendQuoteAdded', item);
  }

  async function deleteItem(id) {
    const newState = [...quotes].filter((x) => x.id !== id);
    setQuotes(newState);

    await connection.send('SendQuoteDeleted', id);
  }

  async function onDragEnd(result) {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    setQuotes((q) => reorder(q, result.source.index, result.destination.index));

    await connection.send('SendPositionMoved', result);
  }

  if (error) {
    return <p>Error establishing signalr connection</p>;
  }

  if (!connection) {
    return <p>Establishing signalr connection...</p>;
  }

  return (
    <React.Fragment>
      <p>User's Connected: {userCount ?? 'Loading...'}</p>

      <button onClick={addItem} className="btn btn-primary mb-3">
        Add New Item
      </button>

      <hr />

      <DragDropContext onDragEnd={(result) => onDragEnd(result, true)}>
        <Droppable droppableId="list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {quotes.map((quote, index) => (
                <Quote quote={quote} index={index} key={quote.id} onDeletePress={deleteItem} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </React.Fragment>
  );
}
