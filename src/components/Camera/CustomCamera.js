import React, {Component, Fragment} from 'react';
import Webcam from 'react-webcam';
import PropTypes from 'prop-types';

class CustomCamera extends Component {
    /**
     * 
     * @param {*} props 
     */
    constructor(props){
        super(props);
        this.state = {
            imageData: null,
            imageName: "",
            saveImage: false,
            videoConstraints: {
                facingMode: 'user',
                height: props.height || 300,
                width: props.width || 300,
            }
        }
    }

    /**
     * set private attribute camera
     * @param {object} webcam
     * @returns void
     */
    setRef = webcam => {
        this.webcam = webcam;
    } 

    /**
     * Capture camera picture
     */
    capture = () => {
        const imageSrc = this.webcam.getScreenshot();
        
        this.setState({ imageData: imageSrc }, () => {
            setTimeout(() => {
                this.props.getPhotoTaken(this.state.imageData)
            }, 1000);
        });
    }

    /**
     * Reset imageData state
     */
    retake = () => {
        this.setState({ imageData: null });
    }

    /**
     * Set image state
     */
    onClickSave = () => {
        this.setState(prevState => {
            return {
                saveImage: !prevState.saveImage
            }
        });
    }

    /**
     * set input state
     * @param {object} target
     */
    handleChange = ({target: {name, value}}) => {
        this.setState({ [name]: value })
    }    

    /**
     * render method
     */
    render() {
        return(
            <Fragment>
                <Webcam 
                    audio={false}                    
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={this.state.videoConstraints}
                    className={`${this.state.imageData ? 'd-none' : 'd-block'}`}
                />                
                <img className={`${this.state.imageData ? 'd-block' : 'd-none'}`} src={this.state.imageData} alt=""/>
            </Fragment>
        )
    }
}

CustomCamera.propTypes = {
    height: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    getPhotoTaken: PropTypes.func
};

export default CustomCamera;