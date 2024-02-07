const GetData = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value;
  } catch (error) {}
};

const SetData = (key, data) => {
  try {
    localStorage.setItem(key, data);
  } catch (error) {}
};

const RemoveData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};

const exportedObject = {
  GetData,
  SetData,
  RemoveData,
};

export default exportedObject;
