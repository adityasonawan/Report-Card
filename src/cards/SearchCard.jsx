import React, { Component } from 'react';
import { Dropdown, DropdownItem, TextField, Typography} from '@ellucian/react-design-system/core';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import { useCardControl } from '@ellucian/experience-extension-utils'; 
import * as EllucianUtils from '@ellucian/experience-extension-utils';
console.log(EllucianUtils);

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
            const route = `/report/${encodeURIComponent(event.target.value)}`;
            console.log('Navigating to page with route:', route);
            this.props.navigateToPage({
                route,
                extension: {
                    publisher: 'Sample',
                    extensionName: 'Reports Dropdown',
                    type: 'page'
                }
            });
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
    navigateToPage: PropTypes.func.isRequired
};

function ControlledDropdownExampleWithCardControl(props) {
    const { navigateToPage } = useCardControl();
    return <ControlledDropdownExample {...props} navigateToPage={navigateToPage} />;
}

export default (ControlledDropdownExampleWithCardControl);
