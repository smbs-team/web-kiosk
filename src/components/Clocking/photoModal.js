  import React, {Component} from 'react';
  import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
  import CustomCamera from '../Camera/CustomCamera';

  import PropTypes from 'prop-types';

  class PhotoModal extends Component {
    
    constructor(props) {
        super(props);        
    }

    /**
     * set camera object
     * @param {object} cameraInput
     */
    setReference = cameraInput => {
        this.cameraInput = cameraInput
    }

    /**
     * call camera capture method
     */
    triggerScreenshot = () => {
        this.cameraInput.capture();
    }

    /**
     * reset camera object value
     */
    resetCamera = () => {
        this.cameraInput.retake();
    }

    /**
     * @param {string} photoSrc
     */
    getPhotoTaken = (photoSrc) => {
        this.props.handlePhotoTaken(photoSrc);
    }

    render(){
        return(
            <Modal isOpen={this.props.isOpen} className="PhotoModal">
                <ModalBody>
                    <CustomCamera ref={this.setReference} width={300} height={300} getPhotoTaken={this.getPhotoTaken}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="link" className="text-center w-100 text-secondary" onClick={this.triggerScreenshot}>
                        <i className="fas fa-camera fa-4x"></i>
                    </Button>
                </ModalFooter>
            </Modal>
        )      
    }
  }
  
PhotoModal.propTypes = {
    handlePhotoTaken: PropTypes.func,
    isOpen: PropTypes.bool
};

export default PhotoModal;