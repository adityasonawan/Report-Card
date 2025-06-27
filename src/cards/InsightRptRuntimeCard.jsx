import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { Dropdown, DropdownItem, Typography, TextField, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@ellucian/react-design-system/core';
import { useDataQuery, DataQueryProvider, userTokenDataConnectQuery } from '@ellucian/experience-extension-extras';
import { addTransferPipeline } from '../apis/reportDataOperations';
import { useData } from '@ellucian/experience-extension-utils';


const styles = () => ({
    card: {
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40
    },
    spinnerBox: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

// Extracts all &&param&& parameters from the query string
function extractAmpersandParams(query) {
    const regex = /&&([a-zA-Z0-9_]+)&&/g;
    const params = [];
    let match;
    while ((match = regex.exec(query))) {
        if (!params.includes(match[1])) {
            params.push(match[1]);
        }
    }
    return params;
}

function InsightRptRuntimeCardInner(props) {
    const { classes } = props;
    const [selectedReport, setSelectedReport] = React.useState(null);
    const [paramValues, setParamValues] = React.useState({});
    //const [showQuery, setShowQuery] = React.useState(false);
    const [showQueryModal, setShowQueryModal] = React.useState(false);
    const [lastSubmission, setLastSubmission] = React.useState(null);
    const [sending, setSending] = React.useState(false); // <-- add this
    const [sendSuccess, setSendSuccess] = React.useState(false); // <-- add this
    const { authenticatedEthosFetch } = useData();

    // Use useDataQuery with NO arguments, so it uses the provider's options
    const { data, isLoading, isError } = useDataQuery('x-xgrptdfn-get', { queryParameters: { acceptVersion: '1' } });

    const reportData = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

    const handleChange = event => {
        const selectedName = event.target.value;
        const report = reportData.find(r => r.xgrptdfnReportname === selectedName);
        setSelectedReport(report);
        setParamValues({});
        //setShowQuery(false);
    };

    let query = '';
    let ampParams = [];
    let guid = '';
    if (selectedReport) {
        try {
            const specs = JSON.parse(selectedReport.xgrptdfnReportspecs);
            console.log('specs:', specs);
            query = specs?.reportSpecifications?.insightQuery?.query || '';
            ampParams = extractAmpersandParams(query);
            guid = selectedReport.id || '';
        } catch (e) {
            query = '';
            ampParams = [];
            guid = '';
        }
    }

    const handleParamChange = (param, value) => {
        setParamValues(prev => ({ ...prev, [param]: value }));
    };

    const handleRun = async () => {
    setSending(true);
    setSendSuccess(false);

    // Prepare the payload for your transfer pipeline
    const transferParams = {
        guid,
        // ...other required params...
        ...paramValues
        // e.g. sftpHost, sftpUsername, etc.
    };

    setLastSubmission(transferParams); // <-- now used

    try {
        await addTransferPipeline({
            authenticatedEthosFetch,
            params: transferParams
        });
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 2000);
    } catch (err) {
        console.error('Failed to send query to transfer pipeline:', err);
    } finally {
        setSending(false);
    }
};

    // Replace &&param&& with user values
    let finalQuery = query;
    ampParams.forEach(param => {
        const value = paramValues[param] || '';
        finalQuery = finalQuery.replace(new RegExp(`&&${param}&&`, 'g'), value);
    });

    if (isLoading) {
        return (
            <div className={classes.spinnerBox}>
                <CircularProgress />
            </div>
        );
    }
    if (isError) return <div>Error loading data</div>;

    return (
        <div className={classes.card}>
            <Dropdown
                label="Reports"
                onChange={handleChange}
                value={selectedReport ? selectedReport.xgrptdfnReportname : ''}
            >
                {reportData.map(option => (
                    <DropdownItem key={option.xgrptdfnReportid} label={option.xgrptdfnReportname} value={option.xgrptdfnReportname} />
                ))}
            </Dropdown>

            {selectedReport && (
                <div style={{ marginTop: 16 }}>
                    <Button
                        type="button"
                        style={{ marginBottom: 8 }}
                        onClick={e => {
                            e.stopPropagation();
                            setShowQueryModal(true);
                        }}
                    >
                        View Query
                    </Button>
                    <Dialog open={showQueryModal} onClose={() => setShowQueryModal(false)}>
                        <DialogTitle>Query</DialogTitle>
                        <DialogContent>
                            <Typography variant="body2">
                                <code style={{ whiteSpace: 'pre-wrap' }}>{query}</code>
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
                                    setShowQueryModal(false);
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {ampParams.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                            <Typography variant="h6">Query Parameters</Typography>
                            {ampParams.map(param => (
                                <TextField
                                    key={param}
                                    label={param}
                                    value={paramValues[param] || ''}
                                    onChange={e => handleParamChange(param, e.target.value)}
                                    onClick={e => e.stopPropagation()}
                                    style={{ marginBottom: 8 }}
                                />
                            ))}
                        </div>
                    )}
                    {ampParams.length === 0 && (
                        <Typography>No parameters required for this query.</Typography>
                    )}
                    <Button
                        type="button"
                        style={{ marginTop: 8 }}
                        onClick={e => {
                            e.stopPropagation();
                            handleRun();
                        }}
                        disabled={sending} // <-- disable while sending
                    >
                        {sending ? <CircularProgress size={20} /> : 'Send Query'}
                        </Button>
                        {sendSuccess && (
                            <Typography style={{ color: 'green', marginTop: 8 }}>
                                Query sent successfully!
                            </Typography>
                        )}
                    {lastSubmission && (
                        <div style={{ marginTop: 16 }}>
                            <Typography variant="body2">Last Submission:</Typography>
                            <pre>{JSON.stringify(lastSubmission, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

InsightRptRuntimeCardInner.propTypes = {
    classes: PropTypes.object.isRequired
};

const StyledInsightRptRuntimeCardInner = withStyles(styles)(InsightRptRuntimeCardInner);

function InsightRptRuntimeCard(props) {
    const options = React.useMemo(() => ({
        queryFunction: userTokenDataConnectQuery,
        resource: 'x-xgrptdfn-get',
        queryParameters: { acceptVersion: '1' }
    }), []);

    return (
        <DataQueryProvider options={options}>
            <StyledInsightRptRuntimeCardInner {...props} />
        </DataQueryProvider>
    );
}

export default InsightRptRuntimeCard;