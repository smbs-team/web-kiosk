import React, {Fragment, Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import Clock from './clock';
import CustomAlert from '../Alert/Alert';
import MarkScreen from './MarkScreen';
import Pin from './Pin';
import SelectPosition from './selectPosition';

import {FETCH_SHIFTS_ORDERED} from './queries';
import {ADD_MARK} from './mutations';
import default_user from './default_user.png';
import { LOGIN_LINK } from '../../configuration';

import axiosGraphClient from '../../helpers/axiosGraphClient';
import requestCamera from '../../helpers/checkCameraSupport';

class ExternalClocker extends Component{

    INITIAL_STATE = {
        search: "",        
        showInsertPin: false,
        showMarkButtons: false,
        showPositionButtons: false,
        pin: "",
        positionId: null,
        matchEmployee: false,
        logoutPass: "",
        openConfirmLogout: false,
        showAlert: false,
        alertTitle: '',
        alertMsg: '',
        alertTimer: null,
        showConfirmButton: true,
        alertType: "success" //success, error, question
    }

    constructor(props){
        super(props);

        this.state = {
            idEntity: localStorage.getItem("Id_Entity"),
            loggedUser: localStorage.getItem("CodeUser"),
            users: [],
            displayList: [],
            currentDate: moment(new Date()).format('MMMM Do YYYY'),
            cameraAvailable: false,
            ...this.INITIAL_STATE
        }
    }

    componentDidMount(){
        this.loadUserList();
        this.setCameraAvailable();
    }

    setCameraAvailable = async () => {
        const hasCamera = await requestCamera();
        this.setState({ cameraAvailable: hasCamera });
    }

    /**
     * @param {boolean} reload Indicates if the user list should be reloaded
     */
    resetState = (reload = false) => {
        this.setState({...this.INITIAL_STATE}, () => {
            if(reload && typeof reload === "boolean") {
                this.loadUserList();
            }
        });
    }

    /**
     * Loads list of users to mark time
     */
    loadUserList = () => {
        axiosGraphClient.query({
            query: FETCH_SHIFTS_ORDERED,
            fetchPolicy: "no-cache",
            variables: { idEntity: parseInt(this.state.idEntity)}
        })
        .then(({employeesWSSN: employees}) => {
            const users = employees.map(e => {
                return {
                    id: e.id,
                    idEntity: e.idEntity,
                    name: `${e.Application.firstName.trim()} ${e.Application.lastName.trim()}`,
                    pin: e.Application.pin,
                    photo: e.Application.Urlphoto,
                    positions: e.positions
                }
            });

            this.setState(() => {
                return { users, displayList: users }
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    /**
     * @param {String} name Name to search for
     * Searches for a user within the loaded array
     */
    searchUser = name => {
        if(name) {
            const users = this.state.users.filter(user => {
                return user.name.trim().toLowerCase().includes(name.trim().toLowerCase());
            });

            this.setState({ displayList: users });
        } else {
            this.setState({ displayList: [...this.state.users] });
        }
    }

    /**
     * @param {Object} target automaticall passed by react
     */

    handleChangeSearch = ({target: {value}}) => {
        this.setState(() => {
            return { search: value }
        }, () => {
            this.searchUser(value);            
        });
    }

    /**
     * @param {Object} target automaticall passed by react
     */
    handleLogoutPassChange = ({target: {value}}) => {
        this.setState(() => {
            return { logoutPass: value }
        });
    }

    /**
     * @param {Object} target automatically passed by react
     */
    handlePinChange = ({target: {value: pin}}) => {
        const digits = /^\d{0,4}$/;
        
        if(digits.test(pin)){
            this.setState({pin});
        }
    }   

    //#region Modal Toggles
    toggleConfirmLogoutModal = (afterToggle) => {
        this.setState(prevState => {
            return {
                openConfirmLogout: !prevState.openConfirmLogout,
                logoutPass: prevState.openConfirmLogout ? "" : prevState.logoutPass
            }
        }, () => {
            if(afterToggle && typeof afterToggle === "function"){
                afterToggle();
            }
        });
    }

    togglePinModal = () => {
        this.setState(prev => {
            return {
                showInsertPin: !prev.showInsertPin,                                
            }
        }, () => {
            if (!this.state.showInsertPin) {
                this.resetState(true);                
            }
        });
    }

    toggleMarksModal = (positionId = null) => {
        this.setState(prev => {
            return {
                showMarkButtons: !prev.showMarkButtons,         
                positionId                     
            }
        });
    }

    togglePositionsModal = () => {
        this.setState(prev => {
            return {
                showPositionButtons: !prev.showPositionButtons,                              
            }
        });
    }

    togglePhotoModal = () => {
        this.setState(prevState => {
            return { openPhotoModal: !prevState.openPhotoModal }
        });
    }
    //#endregion

    /**
     * @param {int} newMarkId Id of the type of mark to be registered, e.g. Clock-out
     * @param {int} positionId Id of the Position the employee is punching on
     */    
    handleMarking = (newMarkId, positionId = null, photoURL = "") => {
        const newMark = {
            entityId: parseInt(this.state.idEntity),
            typeMarkedId: parseInt(newMarkId),
            markedDate: new Date(),
            markedTime: moment(new Date()).format('HH:mm').toString(),
            imageMarked: photoURL,
            EmployeeId: this.state.matchEmployee.id,
            positionId: parseInt(positionId)
        }

        axiosGraphClient.mutate({
            mutation: ADD_MARK,
            variables: {
                mark: newMark
            }
        })
        .then(() => {            
            this.displayAlert("Success!", "Your punch has been saved!", "success", 2000, false);            
        })
        .catch(() => {
            this.displayAlert("Error", "There was a problem saving your punch, please try again.", "error");            
        });        
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

    /**
     * @param {Object} user User info
     */
    setUser = user => () => {
        this.setState({ matchEmployee: user }, this.togglePinModal);
    }

    renderPinInsert = () => {
        return(
            <Pin matchEmployee={this.state.matchEmployee} toggleMarksModal={this.toggleMarksModal} togglePositionsModal={this.togglePositionsModal} togglePinModal={this.togglePinModal} />
        )
    }

    renderMarkModal = () => {
        return(<MarkScreen cameraAvailable={this.state.cameraAvailable} positionId={this.state.positionId} logOut={this.resetState} toggleConfirmLogoutModal={this.toggleConfirmLogoutModal} handleMarking={this.handleMarking} show={this.state.showMarkButtons} matchEmployee={this.state.matchEmployee} />)
    }

    renderSelectPositionModal = () => {
        if(this.state.matchEmployee) {
            return <SelectPosition cameraAvailable={this.state.cameraAvailable} handleMarking={this.handleMarking} matchEmployee={this.state.matchEmployee} logOut={this.resetState} toggleConfirmLogoutModal={this.toggleConfirmLogoutModal} show={this.state.showPositionButtons} />
        }
    }

    renderLogoutModal = () => {
        return(
            <Modal isOpen={this.state.openConfirmLogout} className="ConfirmLogout">
                <ModalHeader className="text-center" style={{borderBottom: "none"}}>
                    Please confirm password to Logout.
                </ModalHeader>
                <ModalBody>
                    <label htmlFor="logoutPass" className="d-block">Password: </label>
                    <input  type="password" onChange={this.handleLogoutPassChange} name="logoutPass" id="logoutPass" className="form-control" value={this.state.logoutPassword} />
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" onClick={this.toggleConfirmLogoutModal}>Cancel</button>
                    <button className="btn btn-success" onClick={this.logOut}>Ok</button>
                </ModalFooter>
            </Modal>
        )
    }

    renderUsers = () => {
        return this.state.displayList.map((user, index) => {
            return(
                <li key={index} className="Kiosk-user" onClick={this.setUser(user)}>
                    <img className="Kiosk-user-pic" src={user.photo || default_user} alt={user.name} />
                    <span className="Kiosk-user-name"> {user.name} </span>
                </li>
            )
        })
    }

    /**
     * @param {Event} event passed by react
     * Logs the current user out
     */
    
    logOut = () => {
        const config = {
			headers: {
                "Content-Type": "application/json",
			}
        }

        axios.post(LOGIN_LINK, {
			Code_User: this.state.loggedUser, Password: this.state.logoutPass
		}, config)
		.then(() => {
            localStorage.clear();
            window.location.href = '/login';
        })        
        .catch(() => {
            this.toggleConfirmLogoutModal();
            this.displayAlert("Error", "Incorrect Password", "error", null, true);
        });
    }

    render() {
        return(
            <Fragment>
                <CustomAlert 
					show={this.state.showAlert}
					title={this.state.alertTitle}
					text={this.state.alertMsg}
					type={this.state.alertType}
                    onConfirm={() => this.resetState(true)}
                    timer={this.state.alertTimer}
                    showConfirmButton={this.state.showConfirmButton}
				/>
                <div className="Kiosk">
                    <div className="container-fluid Kiosk-container">
                        <div className="row pt-0 pb-0 mr-0 ml-0">
                            <div className="col-xs-12 col-md-6 Kiosk-left">
                                <div className="gen-col-centered" style={{height: "100%"}}>
                                    <div className="Kiosk-dateTime">
                                        <span className="Kiosk-date">{this.state.currentDate}</span>
                                        <Clock className="Kiosk-time" />
                                    </div>
                                    <button className="btn Kiosk-logout" type="button" onClick={this.toggleConfirmLogoutModal}>
                                        Log Out&nbsp;&nbsp;
                                    <i className="fas fa-sign-out-alt"></i>
                                </button>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-6 pr-0 pl-0">
                                { 
                                    this.state.showInsertPin ? this.renderPinInsert() : 
                                    <div className="card Kiosk-list">
                                        <div className="card-header Kiosk-header">                            
                                            <input type="text" name="search" placeholder="Seach" id="search" value={this.state.search} onChange={this.handleChangeSearch} className="form-control Kiosk-search"  />                            
                                        </div>
                                        <div className="card-body">
                                            <ul className="Kiosk-users">
                                                { this.renderUsers() }
                                            </ul>
                                        </div>                                        
                                    </div>
                                 }
                            </div>
                        </div>
                    </div>
                </div>                
                { this.renderMarkModal() }
                { this.renderLogoutModal() }
                { this.renderSelectPositionModal() }
            </Fragment>
        );
    }

    static contextTypes = {
		loginHttpLink: PropTypes.string
	};
}

export default ExternalClocker;
