import React, { Component, Fragment } from 'react';
import AxiosGraph from '../../helpers/axiosGraphClient';
import CustomAlert from '../Alert/Alert';
import {GET_OPEN_CLOCKIN} from './queries';
import default_user from './default_user.png';

import PropTypes from 'prop-types';

const numbers = [1,2,3,4,5,6,7,8,9];

class Pin extends Component {

    INITIAL_STATE = {
        pin: "",
        processing: false,
        alertTimer: null,
        showConfirmButton: true
    }

    constructor(props){
        super(props);

        this.state = {
            showAlert: false,
            idEntity: localStorage.getItem("Id_Entity"),
            alertTitle: '',
            alertMsg: '',
            alertType: "success", //success, error, question            
            ...this.INITIAL_STATE
        }
    }

    displayAlert = (title, text, type, timer = null, showConfirmButton = true) => {
		this.setState(() => ({
            showAlert: true,
            alertTitle: title,
            alertMsg: text,
            alertType: type,
            alertTimer: timer,
            showConfirmButton: showConfirmButton
        }));
    }

    handlePinChange = ({target: {value: pin}}) => {
        const digits = /^\d{0,4}$/;
        
        if(digits.test(pin)){
            this.setState({pin});
        }
    }

    handleChangeNumber = (number) => (event) => {
        event.preventDefault();
        const {pin, processing} = this.state;
        
        if(number === -1 && pin.length === 0)
            return;

        if(!processing) {
            this.setState({ processing: true }, () => {        
                if(number === -1 && pin.length > 0){
                    const newPin = pin.substring(0, pin.length - 1);
                    this.setState({ pin: newPin, processing: false })
                    return;
                }
                
                this.setState(prevState => {
                    return { pin: `${prevState.pin}${number}`, processing: false }
                }, () => {
                    if(this.state.pin.length === 4)
                        this.validatePin();
                });
            })
        }
    }

    validatePin = () => {
        const {pin} = this.state;

        if(pin && this.props.matchEmployee && pin === this.props.matchEmployee.pin) {
            this.checkOpenShift()       
        } else {

            this.displayAlert("Error", "Incorrect pin, please try again.", "error", 2000, false);
            
            this.setState(() => {
                return { ...this.INITIAL_STATE }
            });            
        }        
    }

    checkOpenShift = () => {
        if(!this.props.matchEmployee.positions || this.props.matchEmployee.positions.length === 0) {
            this.props.toggleMarksModal(null);
        } else {
            AxiosGraph.query({
                query: GET_OPEN_CLOCKIN,
                fetchPolicy: "no-cache",
                variables: { 
                    entityId: parseInt(this.state.idEntity),
                    employeeId: this.props.matchEmployee.id
                }
            })
            .then(({clockinIsOpen: {isOpen, positionId}}) => {
                if(isOpen) {
                    this.props.toggleMarksModal(positionId);
                } else {
                    this.props.togglePositionsModal();
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    render() {
        return(
            <Fragment>
                <CustomAlert 
					show={this.state.showAlert}
					title={this.state.alertTitle}
					text={this.state.alertMsg}
					type={this.state.alertType}
                    timer={this.state.alertTimer}
                    showConfirmButton={this.state.showConfirmButton}
                    onConfirm={() => this.setState({showAlert: false})}
				/>
                <div className="Kiosk-gradient Kiosk-pinContainer">
                    <button className="btn btn-link" style={{position: "absolute", top: "0", left: "0"}} onClick={this.props.togglePinModal} type="button">
                        <i className="fas fa-chevron-left fa-3x text-white"></i>
                    </button>
                    <div className="Kiosk-userInfo">
                        <img className="Kiosk-userInfo-pic" src={this.props.matchEmployee.photo || default_user} alt={this.props.matchEmployee.name} />
                        <h5 className="Kiosk-userInfo-title">Hi, {this.props.matchEmployee.name}</h5>
                        <h6 className="Kiosk-userInfo-subtitle">Please, enter your pin</h6>
                    </div>
                    <input type="password" name="pin" value={this.state.pin} id="pin" maxLength="4" pattern="[0-9]{4}" onChange={this.handlePinChange} className="form-control Kiosk-pinInput"/>
                    <div className="Kiosk-pinButtonsContainer">
                        {numbers.map(number => {
                            return <button key={number} disabled={this.state.processing} className="Kiosk-pinButtonNumber" type="button" onClick={this.handleChangeNumber(number)}>{number}</button>
                        })}
                        <button disabled={this.state.processing} className="Kiosk-pinButtonNumber" type="button" onClick={this.handleChangeNumber(0)}>{0}</button>
                        <button disabled={this.state.processing} className="Kiosk-pinButtonNumber" type="button" onClick={this.handleChangeNumber(-1)}>
                            <i className="fas fa-backspace"></i>
                        </button>
                    </div>
                </div>
            </Fragment>
        )
    }    

}

Pin.propTypes = {
    processing: PropTypes.bool,
    matchEmployee: PropTypes.shape({
        id: PropTypes.number,
        photo: PropTypes.string,
        positions: PropTypes.array,
        name: PropTypes.string,
        pin: PropTypes.number
    }),
    toggleMarksModal: PropTypes.func,
    togglePositionsModal: PropTypes.func,
    togglePinModal: PropTypes.bool
};

export default Pin;