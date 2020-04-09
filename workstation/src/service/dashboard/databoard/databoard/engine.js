import axios from "axios";


async function trigger(request_data) {
  let net_request_result = await axios.post("/engine/engine/trigger", request_data);
  if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
  return net_request_result.data;
}

export default {
  trigger,
}
