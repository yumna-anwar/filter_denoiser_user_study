import axios from "axios";

const Get = async (host, loader = true) => {
  return axios
    .get(host)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const Post = async (host, payload, loader = true) => {
  return axios
    .post(host, payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const Put = async (host, payload, loader = true) => {
  return axios
    .put(host, payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const Delete = async (host, payload, loader = true) => {
  return axios
    .delete(host, payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const exportedObject = {
  Get,
  Post,
  Put,
  Delete,
};

export default exportedObject;
