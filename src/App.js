/* global io */

import React from 'react';
import { Button, Col, FormControl, Grid, Jumbotron, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameRunning: false,
            username: '',
        };
    }

    play() {
        this.setState({ gameRunning: true });
        this.props.playClick(this.state.username);
    }

    render() {
        return !this.state.gameRunning ?
            (<Jumbotron className="text-center" style={{ backgroundColor: '#fff' }}>
                <Row>
                    <Col lg={4}/>
                    <Col className="center-block" lg={4}>
                        <h1>Welcome to 2DBR</h1>
                        <br/>
                        <FormControl
                            type="text"
                            name="emptyLinesInput"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={e => this.setState({ username: e.target.value })}
                            style={{ width: '100%' }}>
                        </FormControl>
                        <br/>
                        <Button bsStyle="success" onClick={() => this.play()}>Play!</Button>
                    </Col>
                    <Col lg={4}/>
                </Row>
            </Jumbotron>)
            : <div/>;
    }
}

App.propTypes = {
    playClick: PropTypes.func,
};
