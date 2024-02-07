import RestClient from "../RestClient";

const RunFilterAtest = (payload) => {
  return RestClient.Post(`http://localhost:3001/api/run-filterA-test`, payload);
};
const PlayFilterAtest = (payload) => {
  return RestClient.Get(`http://localhost:3001/api/stream-filterA-audio`);
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
  PlayFilterAtest,
  Login,
  Register,
  GetAllFiles,
  AddUserStudy,
  GetAllUserStudy,
  GetAllUsers,
  GetUserById,
};

export default exportedObject;
