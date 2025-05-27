/*import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { Typography, TextLink } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import React from 'react';

const styles = () => ({
    card: {
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40
    }
});

const HelloworldAsonawaneCard = (props) => {
    const { classes } = props;

    return (
        <div className={classes.card}>
            <Typography variant="h2">
                HelloWorld Test Card
            </Typography>
            <Typography>
                <span>
                    For sample extensions, visit the Ellucian Developer
                </span>
                <TextLink href="https://github.com/ellucian-developer/experience-extension-sdk-samples" target="_blank">
                     GitHub
                </TextLink>
            </Typography>
        </div>
    );
};

HelloworldAsonawaneCard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HelloworldAsonawaneCard);*/
import React, { Component } from 'react';
import { Dropdown, DropdownItem, TextField, Typography} from '@ellucian/react-design-system/core';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

class ControlledDropdownExample extends Component {
    state = {
        reports: '',
        open: false,
        reportId: '',
        showNewReportField: false,
        newReportName: '',
        newReportNameError: false,
        newReportNameErrorMessage: '',
        reportOptions: [] // Dropdown options managed in state
    };

    componentDidMount() {
        fetch('http://localhost:5000/api/reports')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    reportOptions: data.map(r => r.name)
                });
            });
    }

    handleChange = event => {
        const isNewReport = event.target.value === 'New Report';
        if (isNewReport) {
            const newId = uuidv4();
            this.setState({
                reports: 'New Report',
                reportId: newId,
                showNewReportField: true,
                newReportName: '',
                newReportNameError: false,
                newReportNameErrorMessage: ''
            });
        } else {
            this.setState({
                reports: event.target.value,
                reportId: '',
                showNewReportField: false,
                newReportName: '',
                newReportNameError: false,
                newReportNameErrorMessage: ''
            }, () => {
                // Only navigate if history exists
            if (this.props.history && this.props.history.push) {
                this.props.history.push(`/report/${encodeURIComponent(event.target.value)}`);
            }
            });
        }
    };

    handleNewReportNameChange = event => {
        this.setState({
            newReportName: event.target.value,
            newReportNameError: false,
            newReportNameErrorMessage: ''
        });
    };

    handleNewReportNameBlur = () => {
        if (this.state.newReportName.trim() === '') {
            this.setState({
                newReportNameError: true,
                newReportNameErrorMessage: 'Report name is required'
            });
        }
    };

    handleSaveNewReport = () => {
        const trimmedName = this.state.newReportName.trim();
        if (trimmedName === '') {
            this.setState({
                newReportNameError: true,
                newReportNameErrorMessage: 'Report name is required'
            });
            return;
        }
        // Check for duplicate name (case-insensitive)
        const exists = this.state.reportOptions.some(
            name => name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (exists) {
            this.setState({
                newReportNameError: true,
                newReportNameErrorMessage: 'A report with this name already exists'
            });
            return;
        }
        // Save to backend
        fetch('http://localhost:5000/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uuid: this.state.reportId, name: trimmedName })
        })
        //.then(res => res.json())
    
        .then(() => {
            this.setState(prevState => ({
                reportOptions: [...prevState.reportOptions, trimmedName],
                reports: '',
                reportId: '',
                showNewReportField: false,
                newReportName: '',
                newReportNameError: false,
                newReportNameErrorMessage: ''
            }));
        });
    };

    render() {
        const customId = 'ControlledDropdownExample';
        const stringOptions = this.state.reportOptions.map(option => option.toString());

        return (
            <div>
                <Dropdown
                    id={`${customId}_Dropdown`}
                    label="Reports"
                    onChange={this.handleChange}
                    value={this.state.reports}
                    open={this.state.open}
                    onOpen={() => this.setState({ open: true })}
                    onClose={() => this.setState({ open: false })}
                >
                    <DropdownItem label="New Report" value="New Report" />
                    {stringOptions.map(option => (
                        <DropdownItem key={option} label={option} value={option} />
                    ))}
                </Dropdown>
              
                {this.state.showNewReportField && (
                    <div style={{ marginTop: 16 }}>
                        <Typography paragraph>
                            Please enter a name for your new report:
                        </Typography>
                        <TextField
                            error={this.state.newReportNameError}
                            helperText={this.state.newReportNameErrorMessage}
                            id="new-report-name"
                            label="Report Name"
                            name="newReportName"
                            onBlur={this.handleNewReportNameBlur}
                            onChange={this.handleNewReportNameChange}
                            required
                            value={this.state.newReportName}
                             onClick={e => e.stopPropagation()} // so it doesnt click the card instead of text field
                        />
                         <button
                            onClick={e => {
                                e.stopPropagation();
                                this.handleSaveNewReport();
                            }}
                            style={{ marginTop: 8 }}
                        >
                            Save New Report
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
ControlledDropdownExample.propTypes = {
    history: PropTypes.object
};

export default ControlledDropdownExample;
