/* eslint-disable no-undef */
// eslint-disable-line global-require
import { S3_REG } from '../configuration';
import AWS from 'aws-sdk';
const uuid = require('uuid/v4');
const bluebird = require("bluebird");

/**
 * Uploads a base64 image to AWS, returns image location
 * @param { string } base64 image 
 * @returns { string } image location
 */

const imageUpload = (base64) => {
    const { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION, bucketS3: S3_BUCKET } = S3_REG;    

    AWS.config.setPromisesDependency(bluebird);
    AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });

    const s3 = new AWS.S3();
    const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const imageType = "jpeg";
    
    const params = {
        Bucket: S3_BUCKET,
        Key: `${Date.now()}_${uuid()}.${imageType}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${imageType}`
    }

    return s3.upload(params).promise();
}

export default imageUpload;