import RestClient from "../RestClient";

const RunFilterAtest = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/run-filterA-test`, payload);
};
const RunFilterBtest = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/run-filterB-test`, payload);
};
const RunFilterCtest = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/run-filterC-test`, payload);
};
const RunUserGaintest = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/run-userGain-test`, payload);
};


const AddFilterA = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/add-filter-A`, payload);
};
const AddFilterB = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/add-filter-B`, payload);
};
const AddFilterC = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/add-filter-C`, payload);
};
const AddUserGain = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/add-user-gain`, payload);
};

// GET ALL SAVED FILTER SELECT * FROM filter
const GetFilterA = (payload) => {
  return RestClient.Get(`http://localhost:3001/api/get-filterA`);
};
const GetFilterB = (payload) => {
  return RestClient.Get(`http://localhost:3001/api/get-filterB`);
};
const GetFilterC = (payload) => {
  return RestClient.Get(`http://localhost:3001/api/get-filterC`);
};
const GetUserGain = (payload) => {
  return RestClient.Get(`http://localhost:3001/api/get-usergain`);
};

// GET ONE OF THE FILTER SELECT * FROM filter WHERE sno = ?
const GetFilterAById = (id) => {
  return RestClient.Get(`http://localhost:3001/api/get-filterA-id/${id}`);
};
const GetFilterBById = (id) => {
  return RestClient.Get(`http://localhost:3001/api/get-filterB-id/${id}`);
};
const GetFilterCById = (id) => {
  return RestClient.Get(`http://localhost:3001/api/get-filterC-id/${id}`);
};
const GetUserGainById = (id) => {
  return RestClient.Get(`http://localhost:3001/api/get-usergain-id/${id}`);
};

const Login = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/login`, payload);
};

const Register = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/register`, payload);
};

const GetAllFiles = (payload) => {
  return RestClient.Get(`http://localhost:3001/api/list-files`);
};

const AddUserStudy = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/add-user-study`, payload);
};

const GetAllUserStudy = () => {
  return RestClient.Get(`http://localhost:3001/api/get-all-user-study`);
};

const GetAllUsers = () => {
  return RestClient.Get(`http://localhost:3001/api/get-all-user`);
};

const GetUserById = (id) => {
  return RestClient.Get(`http://localhost:3001/api/get-user/${id}`);
};

const exportedObject = {
  RunFilterAtest,
  RunFilterBtest,
  RunFilterCtest,
  RunUserGaintest,
  AddFilterA,
  AddFilterB,
  AddFilterC,
  AddUserGain,
  GetFilterA,
  GetFilterB,
  GetFilterC,
  GetUserGain,
  GetFilterAById,
  GetFilterBById,
  GetFilterCById,
  GetUserGainById,
  Login,
  Register,
  GetAllFiles,
  AddUserStudy,
  GetAllUserStudy,
  GetAllUsers,
  GetUserById,
};

export default exportedObject;
