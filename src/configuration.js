import { connection } from "./connection";

export const S3_REG = {
    accessKeyId: process.env.REACT_APP_S3_ACCESS,
    secretAccessKey:  process.env.REACT_APP_S3_KEY,
    region:  process.env.REACT_APP_S3_REGION,
    bucketS3:  process.env.REACT_APP_S3_BUCKET,
}

export const LOGIN_LINK = `${connection}/login`;