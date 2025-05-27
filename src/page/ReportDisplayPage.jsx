import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ReportDisplayPage = () => {
    const { name } = useParams();
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('ReportDisplayPage route param name:', name);
        console.log('ReportDisplayPage location:', location);
        fetch(`http://localhost:5000/api/reports/${encodeURIComponent(name)}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Report not found');
                }
                return res.json();
            })
            .then(data => setReport(data))
            .catch(err => setError(err.message));
    }, [name]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!report) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{report.name}</h1>
            {}
        </div>
    );
};

export default ReportDisplayPage;