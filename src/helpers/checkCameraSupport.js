/**
 * Checks if camera is available
 * @returns {boolean} is the camera available?
 */

 const requestCamera = async () => {
    if('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try {
            await navigator.mediaDevices.getUserMedia({video: true});                
            return true;
        } catch (error) {
            return false;            
        }            
    } else {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
        
        if(navigator.getUserMedia) {
            try {
                navigator.getUserMedia({video: true});
                return true;
            } catch (error) {     
                return false;
            }
        }
    }

    return false;
 }

 export default requestCamera;