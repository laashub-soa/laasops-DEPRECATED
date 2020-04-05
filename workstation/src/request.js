import axios from "axios";

async function base(vue_component, url, request_data) {
  try {
    if (!vue_component.$Loading) return alert("iview 加载失败");
    vue_component.$Loading.start();
    const res_data = await axios.post(url, request_data);
    vue_component.$Loading.finish();
    return res_data;
  } catch (e) {
    vue_component.$Loading.error();
    throw e;
  }
}

async function exec_sql(vue_component, request_data) {
  return base(vue_component, "/distribution/distribution/data", request_data);
}

async function trigger_engine(vue_component, request_data) {
  return base(vue_component, "/engine/engine/trigger", request_data);
}

export default {
  exec_sql,
  trigger_engine,
}
