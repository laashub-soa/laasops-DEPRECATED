vue_data.designer_logic_data = {
    editor: null,
    cur_writing: {
        id: "",
    },
    standard: {
        display: false,
    }
};
vue_data.designer_logic_data.standard.content =
    `from engine import Data
from engine import Runtime

Runtime.define_dependencies(["dingtalkchatbot"])


def test(engine_data):
    data_id = engine_data["data_id"]
    data_data_id = engine_data["data_data_id"]
    data_event_type = engine_data["data_event_type"]
    logic_id = engine_data["logic_id"]
    func_name = engine_data["func_name"]
    print("test")
    json = Runtime.require('json')
    print("json: ", json)
    print("data_id: ", data_id, "data_data_id: ", data_data_id, "data_event_type: ", data_event_type, "logic_id: ",
          logic_id, "func_name: ", func_name)
    sql_result = Data.get(' select * from designer_data_data_%(data_id)s where id=%(data_data_id)s ',
                          {'data_id': data_id, 'data_data_id': data_data_id})
    print(str(sql_result))
    # Data.get(' select username, password from aliyun ')
    # Data.set(' insert into aliyun(username, password) values(%(username)s, %(password)s) ',
    #          {'username': 'xxx', 'password': 'xxx'})
    # Data.set(' update host set password where id = %(id)s ', {'id': '1'})
    # Data.set(' delete from aliyun where username = %(username)s ', {'username': 'xxx'})


# start data_define
data_define = {
    'get': [
        '21',
    ],
    'set': [
        '21',
    ],
    'trigger': {
        '21': {
            'insert': 'test'
        },
    }
}
#  end data_define

`;

async function init_designer_logic_data_file_view() {
    const editor_ta = document.getElementById("code");
    if (!editor_ta) {
        setTimeout(init_designer_logic_data_file_view, 1000);
        return;
    }
    vue_data.designer_logic_data.editor = CodeMirror.fromTextArea(editor_ta, {
        lineNumbers: true,
        indentUnit: 4,
        styleActiveLine: true,
        matchBrackets: true,
        mode: {
            name: "python",
            version: 3,
            singleLineStringErrors: false
        },
        lineWrapping: true,
        theme: 'monokai',
    });
    vue_data.designer_logic_data.editor.setOption("extraKeys", {
        Tab: function (cm) {
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
        },
        "F11": function (cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function (cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        },
        'Ctrl-S': function () {
            update_designer_logic_data();
        }
    });
    query_designer_logic_data();
}

async function query_designer_logic_data() {
    try {
        const data_struct = {"did": vue_data.designer_logic_directory.cur_selected.id};
        // query data_struct from distribution
        const net_request_result = await do_execute_sql({
            "sql": `
                select id, file
                from designer_logic_data
                where did = %(did)s
            `,
            "parameters": data_struct,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        const data = net_request_result.data[0];
        vue_data.designer_logic_data.cur_writing.id = data['id'];
        vue_data.designer_logic_data.editor.setValue(data['file']);
        component.$Message.success('query success');
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}

async function update_designer_logic_data() {
    try {
        const id = vue_data.designer_logic_data.cur_writing.id;
        const file = vue_data.designer_logic_data.editor.getValue();
        const data_struct = {
            "id": id,
            "file": file,
        };
        console.log(data_struct);
        // query data_struct from distribution
        const net_request_result = await do_execute_sql({
            "sql": `
                update designer_logic_data
                set file = %(file)s
                where id = %(id)s
            `,
            "parameters": data_struct,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        component.$Message.success('update success');
        // update_designer_data_logic_associate
        await update_designer_data_logic_associate(id, file);
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}

async function update_designer_data_logic_associate(logic_id, file){
    const data_logic_associate_str = file.substring(file.indexOf("# start data_define") + "# start data_define".length ,file.indexOf("#  end data_define"));
    const data_logic_associate_obj = eval(data_logic_associate_str);
    let net_request_result;
    net_request_result = await do_execute_sql({
        "sql": "delete from designer_data_logic_io where logic_id = %(logic_id)s;",
        "parameters": {logic_id:logic_id},
    });
    if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;

    net_request_result = await do_execute_sql({
        "sql": "delete from designer_data_logic_trigger where logic_id = %(logic_id)s;",
        "parameters": {logic_id:logic_id},
    });
    if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;

    // sync designer_data_logic_io
    const designer_data_logic_io_get_data_id_arr = data_logic_associate_obj["get"];
    if (designer_data_logic_io_get_data_id_arr && designer_data_logic_io_get_data_id_arr.length>0){
        let designer_data_logic_io_get_sql = "insert into designer_data_logic_io(data_id, logic_id, type) values";
        const designer_data_logic_io_get_data = {};
        for (const item of designer_data_logic_io_get_data_id_arr){
            designer_data_logic_io_get_sql += "(%(data_id_"+item+")s, %(logic_id)s, %(type)s),";
            designer_data_logic_io_get_data["data_id_"+item]= item;
        }
        designer_data_logic_io_get_data["logic_id"] = logic_id;
        designer_data_logic_io_get_data["type"] = "get";
        designer_data_logic_io_get_sql = designer_data_logic_io_get_sql.substring(0,designer_data_logic_io_get_sql.length-1);
        const net_request_result = await do_execute_sql({
            "sql": designer_data_logic_io_get_sql,
            "parameters": designer_data_logic_io_get_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
    }

    const designer_data_logic_io_set_data_id_arr = data_logic_associate_obj["set"];
    if (designer_data_logic_io_set_data_id_arr && designer_data_logic_io_set_data_id_arr.length>0){
        let designer_data_logic_io_set_sql = "insert into designer_data_logic_io(data_id, logic_id, type) values";
        const designer_data_logic_io_set_data = {};
        for (const item of designer_data_logic_io_set_data_id_arr){
            designer_data_logic_io_set_sql += "(%(data_id_"+item+")s, %(logic_id)s, %(type)s),";
            designer_data_logic_io_set_data["data_id_"+item]= item;
        }
        designer_data_logic_io_set_data["logic_id"] = logic_id;
        designer_data_logic_io_set_data["type"] = "set";
        designer_data_logic_io_set_sql = designer_data_logic_io_set_sql.substring(0,designer_data_logic_io_set_sql.length-1);
        const net_request_result = await do_execute_sql({
            "sql": designer_data_logic_io_set_sql,
            "parameters": designer_data_logic_io_set_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
    }


    // sync designer_data_logic_trigger
    const designer_data_logic_io_trigger = data_logic_associate_obj["trigger"];
    if (designer_data_logic_io_trigger && Object.keys(designer_data_logic_io_trigger).length>0){
        const designer_data_logic_io_trigger_level_data_keys = Object.keys(designer_data_logic_io_trigger);
        let designer_data_logic_io_trigger_sql = "insert into designer_data_logic_trigger(data_id, logic_id, func_name, type) values";
        const designer_data_logic_io_trigger_data = {};
        designer_data_logic_io_trigger_data["logic_id"] = logic_id;
        for (const data_id of designer_data_logic_io_trigger_level_data_keys){ // data_id
            const designer_data_logic_io_trigger_level_data_data = designer_data_logic_io_trigger[data_id];
            for (const type of Object.keys(designer_data_logic_io_trigger_level_data_data)){ // type
                const func_name = designer_data_logic_io_trigger_level_data_data[type]; // func_name
                const unique_key_name = data_id + "_" + type;
                designer_data_logic_io_trigger_sql += "(%(data_id_" + unique_key_name + ")s, %(logic_id)s, %(func_name_" + unique_key_name + ")s, %(type_" + unique_key_name + ")s),";
                designer_data_logic_io_trigger_data["data_id_"+unique_key_name]= data_id;
                designer_data_logic_io_trigger_data["func_name_"+unique_key_name]= func_name;
                designer_data_logic_io_trigger_data["type_"+unique_key_name]= type;
            }
        }
        designer_data_logic_io_trigger_sql = designer_data_logic_io_trigger_sql.substring(0,designer_data_logic_io_trigger_sql.length-1);
        const net_request_result = await do_execute_sql({
            "sql": designer_data_logic_io_trigger_sql,
            "parameters": designer_data_logic_io_trigger_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data)return;

    }

}
// TODO improvement: support more language and version, it also effect the backend' code , support the code analysis&check&remind
