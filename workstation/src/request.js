import axios from "axios";

async function base(url, request_data) {
  try {
    component.$Loading.start();
    const res_data = await axios.post(url, request_data);
    component.$Loading.finish();
    return res_data;
  } catch (e) {
    component.$Loading.error();
    throw e;
  }
}

async function exec_sql(request_data) {
  return base("/distribution/distribution/data", request_data);
}

async function trigger_engine(request_data) {
  return base("/engine/engine/trigger", request_data);
}

export default {
  base,
  exec_sql,
  trigger_engine,
}
