import Axios from "axios";

export default (url, options) => {
  return Axios.get("/api" + url, options);
};
