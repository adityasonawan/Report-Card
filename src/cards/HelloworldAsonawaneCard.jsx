import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { Dropdown, DropdownItem, Typography, TextField, Button } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchReports } from '../apis/FetchData';

const styles = () => ({
    card: {
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40
    }
});

const HelloworldAsonawaneCard = (props) => {
    const { classes,
        // cardInfo: { configuration },
        cache: { storeItem } } = props;
    const [reports, setReports] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [reportId, setReportId] = React.useState('');
    const [showNewReportField, setShowNewReportField] = React.useState(false);
    const [newReportName, setNewReportName] = React.useState('');
    const [newReportNameError, setNewReportNameError] = React.useState(false);
    const [newReportNameErrorMessage, setNewReportNameErrorMessage] = React.useState('');
    const [reportOptions, setReportOptions] = React.useState([]);

    const CACHE_KEY = 'local-cache-card:reportData';
    const CACHE_SCOPE = 'local-cache-card:scope';

    React.useEffect(() => {
        fetchReports().then(names => setReportOptions(names));
    }, []);

    const handleChange = event => {
        const isNewReport = event.target.value === 'New Report';
        if (isNewReport) {
            setReports('New Report');
            setReportId(uuidv4());
            setShowNewReportField(true);
            setNewReportName('');
            setNewReportNameError(false);
            setNewReportNameErrorMessage('');
        } else {
            const data = event.target.value;
            setReports(event.target.value);
            setReportId('');
            setShowNewReportField(false);
            setNewReportName('');
            setNewReportNameError(false);
            setNewReportNameErrorMessage('');
            storeItem({ key: CACHE_KEY, scope: CACHE_SCOPE, data: { data } });
            console.log(`Selected report: ${event.target.value}`);
            // Optionally: navigate or handle report selection
        }
    };

    const handleNewReportNameChange = event => {
        setNewReportName(event.target.value);
        setNewReportNameError(false);
        setNewReportNameErrorMessage('');
    };

    const handleNewReportNameBlur = () => {
        if (newReportName.trim() === '') {
            setNewReportNameError(true);
            setNewReportNameErrorMessage('Report name is required');
        }
    };

    const handleSaveNewReport = () => {
        const trimmedName = newReportName.trim();
        if (trimmedName === '') {
            setNewReportNameError(true);
            setNewReportNameErrorMessage('Report name is required');
            return;
        }
        const exists = reportOptions.some(
            name => name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (exists) {
            setNewReportNameError(true);
            setNewReportNameErrorMessage('A report with this name already exists');
            return;
        }
        fetch('http://localhost:5000/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uuid: reportId, name: trimmedName })
        })
            .then(() => {
                setReportOptions(prev => [...prev, trimmedName]);
                setReports('');
                setReportId('');
                setShowNewReportField(false);
                setNewReportName('');
                setNewReportNameError(false);
                setNewReportNameErrorMessage('');
            });
    };

    const customId = 'ControlledDropdownExample';
    const stringOptions = reportOptions.map(option => option.toString());

    return (
        <div className={classes.card}>
            <Dropdown
                id={`${customId}_Dropdown`}
                label="Reports"
                onChange={handleChange}
                value={reports}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
            >
                <DropdownItem label="New Report" value="New Report" />
                {stringOptions.map(option => (
                    <DropdownItem key={option} label={option} value={option} />
                ))}
            </Dropdown>

            {!showNewReportField    && (
                <div>
                <Typography variant="body1" style={{ marginTop: 16 }}>
                    {reports ? `Selected Report: ${reports}` : 'Please select a report or create a new one.'}
                </Typography>
                <Button id={`${customId}_FluidPrimaryButton`} fluid color="primary" className={classes.button}>
                    {reports ? 'View Report definition' : 'No Report Selected'}
                </Button>
                </div>


            )}
            {showNewReportField && (
                <div style={{ marginTop: 16 }}>
                    <Typography paragraph>
                        Please enter a name for your new report:
                    </Typography>
                    <TextField
                        error={newReportNameError}
                        helperText={newReportNameErrorMessage}
                        id="new-report-name"
                        label="Report Name"
                        name="newReportName"
                        onBlur={handleNewReportNameBlur}
                        onChange={handleNewReportNameChange}
                        required
                        value={newReportName}
                        onClick={e => e.stopPropagation()}
                    />
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            handleSaveNewReport();
                        }}
                        style={{ marginTop: 8 }}
                    >
                        Save New Report
                    </button>
                </div>
            )}
        </div>
    );
};

HelloWorldMakarandCard.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object,
    cache: PropTypes.object.isRequired,
    cardInfo: PropTypes.object
};

export default withStyles(styles)(HelloworldAsonawaneCard);
