import React from 'react';
// import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';


function DownloadButton({ data, selectedFields }) {
  const generateFlatFile = () => {
    const headers = selectedFields.map(({ header }) => header);
    const rows = data.map(record =>
      selectedFields.map(({ field }) => {
        let value = record[field];
        return `"${(value ?? "").toString().replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'exported_data.csv');
  };

  return (
    <button onClick={generateFlatFile} disabled={selectedFields.length === 0}>
      Download CSV
    </button>
  );

}

DownloadButton.propTypes = {
  data: PropTypes.array.isRequired,
  selectedFields: PropTypes.array.isRequired
};
export default DownloadButton;