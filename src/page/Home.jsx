import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing20 } from '@ellucian/react-design-system/core/styles/tokens';
import { Typography } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
// import React, { useState } from 'react';
import React from 'react';
import { usePageControl } from '@ellucian/experience-extension-utils';
// import FieldSelector from './FieldSelector'; // Adjust path as needed
// import DownloadButton from './DownloadButton'; // Adjust path as needed

const styles = () => ({
    card: {
        margin: `0 ${spacing20}`
    }
});

// const defaultAvailableFields = [
//     'student_id', 'first_name', 'last_name', 'email', 'gpa', 'major', 'enrollment_date'
// ];

// Example dummy data for download
// const dummyData = [
//     { student_id: 1, first_name: 'Alice', last_name: 'Smith', email: 'alice@example.com', gpa: 3.8, major: 'Math', enrollment_date: '2022-08-15' },
//     { student_id: 2, first_name: 'Bob', last_name: 'Jones', email: 'bob@example.com', gpa: 3.5, major: 'Physics', enrollment_date: '2021-09-01' }
// ];

const HomePage = (props) => {
    const { classes, cache: { getItem } } = props;
    const { setPageTitle } = usePageControl();

    const CACHE_KEY = 'local-cache-card:reportData';
    const CACHE_SCOPE = 'local-cache-card:scope';
    const { data } = getItem({ key: CACHE_KEY, scope: CACHE_SCOPE });

    console.log(`Cache Data: ${JSON.stringify(data, undefined, 3)}`);

    setPageTitle('Report Card');

    // FieldSelector state
    // const [availableFields] = useState(defaultAvailableFields);
    // const [selectedFields, setSelectedFields] = useState([]);

    // Handle dropping a field into selectedFields
    // const handleFieldDrop = (field) => {
    //     if (!selectedFields.some(f => f.field === field)) {
    //         setSelectedFields([...selectedFields, { field, header: field }]);
    //     }
    // };

    return (
        <div className={classes.card}>
            <Typography variant={'h2'}>
                {data?.data || 'No data found in cache'}
            </Typography>

            {/* {/* FieldSelector integration
            <FieldSelector
                availableFields={availableFields}
                selectedFields={selectedFields}
                setSelectedFields={setSelectedFields}
                onFieldDrop={handleFieldDrop}
            />

            {
            <DownloadButton data={dummyData} selectedFields={selectedFields} /> */}
        </div>
    );
};

HomePage.propTypes = {
    classes: PropTypes.object.isRequired,
    cache: PropTypes.object.isRequired
};

export default withStyles(styles)(HomePage);