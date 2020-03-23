import { connection } from "../connection";
import axios from "axios";
const ENDPOINT_URL = `${connection}/graphql`;
/**
 * Graph client with axios
 * @param { object } graphConfig
 * @param { string } graphConfig.query
 * @param { string } graphConfig.mutation
 * @param { {} } graphConfig.variables
 * @param { AxiosRequestConfig } axiosConfig
 * @returns { Promise } promise response
 */

const client = async (graphConfig) => {
  const { query, mutation, variables } = graphConfig;
  const token = localStorage.getItem("Token");
  return new Promise((resolve, reject) => {
    if ((query && mutation) || (!query && !mutation))
      reject("You must indicate a request, query or mutation");

    const queryorMutation = query ? { query } : { query: mutation };

    axios({
      url: ENDPOINT_URL,
      method: "post",
      data: {
        ...queryorMutation,
        variables
      },
      headers: {
        "Content-Type": "application/json",
        authentication: token
      }
    })
      .then(data => {
        let dataReturn = data;
        while (dataReturn && dataReturn.data) {
          dataReturn = dataReturn.data;
        }
        resolve(dataReturn || {});
      })
      .catch(error => {
        reject(error);
      });
  });
}

const axiosGraphClient = {
  query: client,
  mutate: client
};

export default axiosGraphClient;
