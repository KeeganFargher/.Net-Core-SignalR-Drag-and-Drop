import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';

const QuoteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  margin-bottom: 10px;
  background-color: #2c3e50;
  padding: 8px;
  color: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.7), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const DeleteButton = styled.button`
  outline: 0;
  border: 0;
  background: 0;
  color: white;
  font-weight: bold;
`;

export default function Quote({ quote, index, onDeletePress }) {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided) => (
        <QuoteItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          Quote {quote.content}
          <DeleteButton onClick={() => onDeletePress(quote.id)}>X</DeleteButton>
        </QuoteItem>
      )}
    </Draggable>
  );
}
