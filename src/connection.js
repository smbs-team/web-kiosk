const url = {
    cert: process.env.REACT_APP_CERT,
    dev: process.env.REACT_APP_DEV,
    prod: process.env.REACT_APP_PROD,
    local: process.env.REACT_APP_LOCAL
}

export const connection = url['dev'];

