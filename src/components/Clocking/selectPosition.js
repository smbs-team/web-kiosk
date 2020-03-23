import React, {Fragment, Component} from 'react';
import moment from 'moment';

import Clock from './clock';
import PhotoModal from './photoModal';

import default_user from './default_user.png';
import uploadS3 from '../../helpers/s3Upload';

import PropTypes from 'prop-types';

const CLOCKIN = 30570;

class SelectPosition extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentDate: moment(new Date()).format('MMMM Do YYYY'),
            openPhotoModal: false,
            positionId: null            
        }
    }    

    handlePhotoTaken = async photo => {
        const { Location: photoURL } = await uploadS3(photo);
        this.props.handleMarking(CLOCKIN, this.state.positionId, photoURL);

        this.setState({ openPhotoModal: false });
    }

    renderPositionButtons = () => {
        return this.props.matchEmployee.positions.map(p => {
            return <button key={p.id} className="btn btn-default Kiosk-positionButton" onClick={() => this.togglePhotoModal(p.id)}>{p.name}&nbsp;-&nbsp;<i className="far fa-clock"></i></button>
        });
    }

    goBack = () =>{
        this.props.logOut(true);
    }

    togglePhotoModal = id => {
        if(this.props.cameraAvailable) {
            this.setState(prevState => {
                return { 
                    openPhotoModal: !prevState.openPhotoModal,
                    positionId: id
                }
            });
        } else {
            this.props.handleMarking(CLOCKIN, id);
        }
    }

    render() {
        return(
            <Fragment>
                <div className={`Kiosk-marking ${this.props.show ? 'visible' : ''}`}>
                    <div className="container-fluid Kiosk-container">
                        <div className="row pt-0 pb-0 mr-0 ml-0">
                            <div className="col-12 col-md-6 order-2 order-md-1">
                                <div className="gen-col-centered" style={{height: "100%", paddingBottom: "30px", paddingTop: "30px"}}>
                                    <div className="Kiosk-dateTime">
                                        <span className="Kiosk-date">{this.state.currentDate}</span>
                                        <Clock className="Kiosk-time" />
                                    </div>
                                    <button className="btn Kiosk-logout" type="button" onClick={this.props.toggleConfirmLogoutModal}>
                                        Log Out&nbsp;&nbsp;
                                        <i className="fas fa-sign-out-alt"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 pl-0 pr-0 mr-0 ml-0 order-1 order-md-2 Kiosk-gradient" style={{height: "100vh"}}>
                                <div className="Kiosk-marking-right" style={{position: "relative"}}>
                                    <button className="btn btn-link" style={{position: "absolute", top: "0", left: "0"}} onClick={this.goBack} type="button">
                                        <i className="fas fa-chevron-left fa-3x text-white"></i>
                                    </button>                                    
                                    <div className="Kiosk-marking-wrapper" style={{marginBottom: "60px"}}>
                                        <img src={this.props.pic || default_user} alt="User Picture" className="Kiosk-profilePic"/>
                                        <span className="Kiosk-profileName text-center mb-2">Hi, {this.props.matchEmployee.name}</span>
                                        <p className="Kiosk-text text-center">Please clock-in to your current position</p>                            
                                    </div>
                                    <div className="Kiosk-marking-wrapper">
                                        {this.renderPositionButtons()}                                                                    
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

SelectPosition.propTypes = {
    show: PropTypes.bool,
    pic: PropTypes.string,
    toggleConfirmLogoutModal: PropTypes.bool,
    cameraAvailable: PropTypes.bool,
    matchEmployee: PropTypes.shape({
        id: PropTypes.number,
        photo: PropTypes.string,
        positions: PropTypes.array,
        name: PropTypes.string
    }),
    handleMarking: PropTypes.func,
    logOut: PropTypes.func
};

export default SelectPosition;