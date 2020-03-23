import React, {Component, Fragment} from 'react';
import PhotoModal from './photoModal';

import uploadS3 from '../../helpers/s3Upload';
import default_user from './default_user.png';

import PropTypes from 'prop-types';

const CLOCKIN = 30570;
const CLOCKOUT = 30571;
const BREAKIN = 30572;
const BREAKOUT = 30573;

class MarkScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            openPhotoModal: false,
            clockType: null
        }
    }    

    /**
     * @param {object} photo
     */
    handlePhotoTaken = async photo => {
        const { Location: photoURL } = await uploadS3(photo);
        this.props.handleMarking(this.state.clockType, this.props.positionId, photoURL);

        this.setState({ openPhotoModal: false });
    }

    /**
     * open or close modal
     * @param {integer} id
     */
    togglePhotoModal = id => {
        this.setState({ clockType: id }, () => {
            if(this.props.cameraAvailable) {
                this.setState(prevState => {
                    return { 
                        openPhotoModal: !prevState.openPhotoModal                    
                    }
                });
            } else {
                this.props.handleMarking(id, this.props.positionId);
            }
        });
    }

    /**
     * return to main screen
     */
    goBack = () => {
        this.props.logOut(true);
    }

    render(){
        return(
            <Fragment>                         
                <div className={`Kiosk-marking ${this.props.show ? 'visible' : ''}`}>     
                    <div className="container-fluid Kiosk-container">
                        <div className="row pt-0 pb-0 mr-0 ml-0">
                            <div className="col-xs-12 col-md-4 pl-0 pr-0 mr-0 ml-0 Kiosk-gradient">
                                <div className="Kiosk-marking-left">
                                    <div className="Kiosk-wrapper">
                                        <img src={this.props.matchEmployee.photo || default_user} alt="User Picture" className="Kiosk-profilePic"/>
                                        <span className="Kiosk-profileName">Hi, {this.props.matchEmployee.name}</span>                            
                                    </div>
                                    <button className="btn Kiosk-logout" type="button" onClick={this.props.toggleConfirmLogoutModal}>
                                        Log Out&nbsp;&nbsp;
                                        <i className="fas fa-sign-out-alt"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-8">
                                <div className="Kiosk-marking-right">
                                    <button className="btn btn-link" style={{position: "absolute", top: "0", left: "0", color: "#000"}} onClick={this.goBack} type="button">
                                        <i className="fas fa-chevron-left fa-3x"></i>
                                    </button>
                                    <span className="Kiosk-marking-title">Marks:</span>
                                    <div className="Kiosk-marking-options">    
                                        {
                                            !this.props.matchEmployee.positions || this.props.matchEmployee.positions.length === 0 ? (
                                                <button className="btn Kiosk-button clock-in" onClick={() => this.togglePhotoModal(CLOCKIN)} type="button">
                                                    Clock In&nbsp;&nbsp;<i className="fas fa-clock"></i>
                                                </button>
                                            ) : ""
                                        }
                                        <button className="btn Kiosk-button clock-out" onClick={() => this.togglePhotoModal(CLOCKOUT)} type="button">
                                            Clock Out&nbsp;&nbsp;<i className="fas fa-clock"></i>
                                        </button>                    
                                        <button className="btn Kiosk-button break-in" onClick={() => this.togglePhotoModal(BREAKIN)} type="button">
                                            Break In&nbsp;&nbsp;<i className="fas fa-coffee"></i>
                                        </button>                    
                                        <button className="btn Kiosk-button break-out" onClick={() => this.togglePhotoModal(BREAKOUT)} type="button">
                                            Break Out&nbsp;&nbsp;<i className="fas fa-coffee"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
                { this.props.cameraAvailable ? <PhotoModal isOpen={this.state.openPhotoModal} handlePhotoTaken={this.handlePhotoTaken} /> : "" }               
            </Fragment>
        )
    }
}

MarkScreen.propTypes = {
    show: PropTypes.bool,
    positionId: PropTypes.number.isRequired,
    toggleConfirmLogoutModal: PropTypes.bool,
    cameraAvailable: PropTypes.bool,
    matchEmployee: PropTypes.object,
    handleMarking: PropTypes.func,
    logOut: PropTypes.func
};

export default MarkScreen;
