import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ControlledDropdownExample from '../cards/SearchCard';
import ReportDisplayPage from './ReportDisplayPage';
import Home from './Home';

const router = (props) => {
    console.log('Base path:', props.pageInfo.basePath);
    return (
        <Router basename={props.pageInfo.basePath}>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => {
                        console.log('Rendering Home route');
                        return <Home {...props} />;
                    }}
                />
                <Route
                    path="/dropdown"
                    render={(routeProps) => {
                        console.log('Rendering ControlledDropdownExample route', routeProps);
                        return <ControlledDropdownExample {...props} {...routeProps} />;
                    }}
                />
                <Route path="/report/:name" render={(routeProps) => <ReportDisplayPage {...props} {...routeProps} />} />
            </Switch>
        </Router>
    );
};

router.propTypes = {
    pageInfo: PropTypes.object
};

export default router;