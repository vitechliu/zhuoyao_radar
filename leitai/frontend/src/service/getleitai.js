import request from "../util/request";
export default (longitude = 118796471, latitude = 32057381) => {
  return request("/leitai", {
    params: {
      longitude,
      latitude
    }
  });
};
