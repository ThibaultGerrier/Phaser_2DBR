import React from 'react';
import { Button, FormControl, Grid } from 'react-bootstrap';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            gameRunning: false,
            username: '',
        };
    }

    play() {
        this.setState({ gameRunning: true });
        const { username } = this.state;
        console.log(username);
    }

    render() {
        return (
            <div>
                {!this.state.gameRunning &&
                    <Grid className="center-container">
                        <h1>Welcome to 2DBR</h1>
                        <br/>
                        <FormControl
                            type="text"
                            name="emptyLinesInput"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={e => this.setState({ username: e.target.value })}
                            style={{ width: '50%' }}>
                        </FormControl>
                        <br/>
                        <Button bsStyle="success" onClick={() => this.play()}>Play!</Button>
                    </Grid>
                }
            </div>
        );
    }
}
