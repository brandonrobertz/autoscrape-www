import axios from 'axios';

import { apiBase } from 'config';

/**
 * Custom error handler for passing response objects
 * back to the error handlers/state tree for easier
 * parsing of status codes, response body, etc.
 */
export default class APIError extends Error {
  constructor(error) {
    super(error);
    this.message = error.message;
    this.response = error.response;
  }
}

const handleError = (error) => {
  // if we got an error back from the server, throw it
  if (error && error.response && error.response.data) {
    throw new APIError({
      message: error.response.data.message,
      response: error.response
    });
  } else {
    throw new Error(error.message);
  }
};

export const startScrape = (data) => {
  const url = `${apiBase}/start`;
  return axios.post(url, data)
    .then((response) => response.data)
    .catch(handleError);
};

export const stopScrape = (data) => {
  const body = data.body;
  const url = `${apiBase}/stop/${data.id}`;
  return axios.post(url, body)
    .then((response) => response.data)
    .catch(handleError);
};

export const pollProgress = (data) => {
  const url = `${apiBase}/status/${data.id}`;
  return axios.get(url)
    .then((response) => response.data)
    .catch(handleError);
};

export const fetchFile = (data) => {
  const url = `${apiBase}/files/data/${data.id}/${data.file_id}`;
  return axios.get(url)
    .then((response) => response.data)
    .catch(handleError);
};

export const fetchFilesList = (data) => {
  const url = `${apiBase}/files/list/${data.id}`;
  return axios.get(url)
    .then((response) => response.data)
    .catch(handleError);
};
