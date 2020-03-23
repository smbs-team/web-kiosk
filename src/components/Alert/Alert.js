import React, {useState, useEffect} from 'react';
import SweetAlert from 'sweetalert2-react';
import PropTypes from 'prop-types';

/**
 * Sweet alert costomized component
 * @param {*} props 
 */
const CustomAlert = (props) => {
    const [shouldShow, changeShow] = useState(props.show);

    useEffect(() => {
        changeShow(props.show);

        if(props.show && props.timer) {
            setTimeout(() => {
                if(props.onConfirm && typeof props.onConfirm === "function") {
                    props.onConfirm()
                }

                changeShow(false);
            }, props.timer);
        }        
    }, [props.show]);

    return(
        <SweetAlert
            {...props}
            show={shouldShow}
            title={props.title}
            text={props.text}
            type={props.type}
            onConfirm={props.onConfirm}                        
        />
    )
}

CustomAlert.propTypes = {
    show: PropTypes.bool.isRequired,
    timer: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onConfirm: PropTypes.func
};

export default CustomAlert;