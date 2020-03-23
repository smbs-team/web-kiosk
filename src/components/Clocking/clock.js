import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Clock extends Component {	
	/**
	 * constructor
	 * @param {*} props 
	 */
	constructor(props) {		
		super(props)		
		this.state = {
			time: new Date().toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })
		}		
	}
	
	componentDidMount() {		
		this.clockInterval = setInterval(this.update, 1000);
	}
	
	/**
	 * update mark's time 
	 */
	update = () => {
		this.setState({ time: new Date().toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' }) })				
	};

	componentWillUnmount() {
		clearInterval(this.clockInterval);
	}
	
	render() {		
		return (		
			<span className={this.props.className}>{this.state.time}</span>		
		)		
	}	
}

Clock.propTypes = {
    className: PropTypes.string
};

export default Clock;