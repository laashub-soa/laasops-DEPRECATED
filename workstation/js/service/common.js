let url_prefix = "http://" + window.location.host;

function init_axios() {
    if (axios) {
        axios.defaults.baseURL = url_prefix;
        axios.defaults.crossDomain = true;
    }
}

async function base_request(url, request_data) {
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

async function do_execute_sql(request_data) {
    return await base_request("/distribution/distribution/data", request_data);
}

async function do_trigger_engine(request_data) {
    return await base_request("/engine/engine/trigger", request_data);
}

init_axios();
String.prototype.format = function () {
    if (arguments.length == 0) return this;
    const obj = arguments[0];
    let s = this;
    for (const key in obj) {
        s = s.replace(new RegExp("\\{\\{" + key + "\\}\\}", "g"), obj[key]);
    }
    return s;
};