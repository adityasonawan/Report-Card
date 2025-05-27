import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';


function FieldSelector({ availableFields, selectedFields, onFieldDrop, setSelectedFields }) {
  const [search, setSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempHeader, setTempHeader] = useState("");

  const filteredFields = availableFields.filter(field =>
    field.toLowerCase().includes(search.toLowerCase())
  );

  const handleReorder = (result) => {
    if (!result.destination) return;

    const updated = Array.from(selectedFields);
    const [removed] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, removed);
    setSelectedFields(updated);
  };

  const handleDelete = (field) => {
    setSelectedFields(selectedFields.filter(item => item.field !== field));
  };

  const startEditing = (index, currentHeader) => {
    setEditingIndex(index);
    setTempHeader(currentHeader);
  };

  const saveHeader = (index) => {
    const updated = [...selectedFields];
    updated[index].header = tempHeader.trim() || updated[index].field;
    setSelectedFields(updated);
    setEditingIndex(null);
    setTempHeader("");
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {/* Available Fields */}
      <div>
        <h3>Available Fields</h3>
        <input
          type="text"
          placeholder="Search fields..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginBottom: '8px',
            width: '100%',
            padding: '5px',
            boxSizing: 'border-box'
          }}
        />
        <div
          style={{
            height: '250px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '0.5rem',
            width: '250px',
            background: '#fff'
          }}
        >
          {filteredFields.length > 0 ? (
            filteredFields.map(field => (
              <div
                key={field}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("field", field)}
                style={{
                  padding: '6px',
                  borderBottom: '1px solid #eee',
                  cursor: 'grab',
                  userSelect: 'none'
                }}
              >
                {field}
              </div>
            ))
          ) : (
            <div style={{ color: '#999' }}>No fields found.</div>
          )}
        </div>
      </div>

      {/* Selected Fields */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const field = e.dataTransfer.getData("field");
          onFieldDrop(field);
        }}
        style={{
          padding: '1rem',
          border: '2px dashed blue',
          minHeight: '100px',
          width: '100%'
        }}
      >
        <h3>Selected Fields with Editable Headers</h3>

        <DragDropContext onDragEnd={handleReorder}>
          <Droppable droppableId="selectedFields" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
              >
                {selectedFields.map(({ field, header }, index) => (
                  <Draggable key={field} draggableId={field} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid green',
                          borderRadius: '6px',
                          background: '#f6fff6',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          minWidth: '120px',
                          ...provided.draggableProps.style
                        }}
                      >
                        {editingIndex === index ? (
                          <input
                            value={tempHeader}
                            onChange={(e) => setTempHeader(e.target.value)}
                            onBlur={() => saveHeader(index)}
                            onKeyDown={(e) => e.key === 'Enter' && saveHeader(index)}
                            //autoFocus
                            style={{ fontWeight: 'bold', fontSize: '0.9em', width: '100%' }}
                          />
                        ) : (
                          <div
                            onClick={() => startEditing(index, header)}
                            style={{ fontWeight: 'bold', cursor: 'pointer' }}
                            title="Click to edit header"
                          >
                            {header}
                          </div>
                        )}
                        <div style={{ fontSize: '0.8em', color: '#666' }}>{field}</div>
                        <button
                          onClick={() => handleDelete(field)}
                          style={{
                            marginTop: '4px',
                            background: 'transparent',
                            border: 'none',
                            color: '#d00',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                          }}
                        >
                          ✖ Remove
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

FieldSelector.propTypes = {
  availableFields: PropTypes.array.isRequired,
  selectedFields: PropTypes.array.isRequired,
  setSelectedFields: PropTypes.func.isRequired,
  onFieldDrop: PropTypes.func.isRequired
};

export default FieldSelector;