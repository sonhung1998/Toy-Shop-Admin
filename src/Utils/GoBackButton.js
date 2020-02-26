import React from 'react';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';

const GoBackButton = (props) => {
    const goBack = (event) => {
        // event.preventDefault();
        props.history.goBack();
    }
    return (
        <Button
            type="primary"
            onClick={goBack}
            style={props.style}
        >
            {props.name}
        </Button>
    )
}
export default withRouter(GoBackButton)