const editable_table_common_operation_column_width = 90;
const table_column_operation_status_width = 130;

let editable_table_common_column_width = calculate_table_column_width(3);

function editable_table_common_column(data_name, title, key) {
    return {
        title: title,
        key: key,
        sortable: true,
        width: editable_table_common_column_width,
        resizable: true,
        // fixed: 'left',
        align: 'center',
        titleHtml: ' <i class="ivu-icon ivu-icon-edit"></i>',
        editable: true,
        resizable: true,
        render: function (h, params) {
            // is in edit status
            if (vue_data[data_name].is_in_opt && vue_data[data_name].opt_line == params.index) {
                let edit_value = "";
                if ("insert" == vue_data[data_name].opt_name) {
                } else if ("update" == vue_data[data_name].opt_name) {
                    edit_value = vue_data[data_name].data[params.index][params.column.key];
                }
                return h('Input', {
                    props: {
                        type: 'text',
                        value: edit_value
                    },
                    on: {
                        'on-change'(event) {
                            vue_data[data_name].data[params.index][params.column.key] = event.target.value;
                        }
                    }
                })
            }
            return h('div', {
                domProps: {
                    innerHTML: vue_data[data_name].data[params.index][params.column.key],
                },
            })
        }
    }
}


function editable_table_common_operation_column(data_name) {
    return {
        title: 'operation',
        slot: 'operation',
        align: 'center',
        width: editable_table_common_operation_column_width,
        resizable: true,
        render: (h, params) => {
            const div_data = [];
            if (vue_data[data_name].is_in_opt && vue_data[data_name].opt_line == params.index) {
                div_data.push(h('Button', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    },
                    style: {
                        marginRight: '10px',
                        marginTop: '10px',
                        marginBottom: '10px',
                    },
                    on: {
                        click: () => {
                            const cur_line_index = params.index;
                            const cur_line_data = vue_data[data_name].data[cur_line_index];
                            cancel_opt_data(cur_line_data);
                        }
                    }
                }, 'cancel'));
                div_data.push(h('Button', {
                    props: {
                        type: 'error',
                        size: 'small'
                    },
                    style: {
                        marginRight: '10px',
                        marginTop: '10px',
                        marginBottom: '10px',
                    },
                    on: {
                        click: () => {
                            const cur_line_index = params.index;
                            const cur_line_data = vue_data[data_name].data[cur_line_index];
                            cur_line_data['did'] = vue_data.designer_data_directory.cur_selected.id;
                            opt_data(cur_line_data);
                        }
                    }
                }, 'save'));
            }
            let is_display_edit = true;
            if (vue_data[data_name].is_in_opt && vue_data[data_name].opt_line == params.index && ("update" == vue_data[data_name].opt_name || "insert" == vue_data[data_name].opt_name)) {
                is_display_edit = false;
            }
            if (is_display_edit) {
                div_data.push(h('Button', {
                    props: {
                        type: 'error',
                        size: 'small'
                    },
                    style: {
                        marginRight: '10px',
                        marginTop: '10px',
                        marginBottom: '10px',
                    },
                    on: {
                        click: () => {
                            const cur_line_index = params.index;
                            vue_data[data_name].is_in_opt = true;
                            vue_data[data_name].opt_name = "update";
                            vue_data[data_name].opt_line = cur_line_index;
                            const cur_line_data = vue_data[data_name].data[cur_line_index];
                            vue_data[data_name].data[cur_line_index] = cur_line_data;
                            cur_line_data['did'] = vue_data.designer_data_directory.cur_selected.id;
                            vue_data[data_name].data_line_backup = JSON.parse(JSON.stringify(cur_line_data));
                        }
                    }
                }, 'edit'));
            }
            if (is_display_edit) {
                div_data.push(h('Button', {
                    props: {
                        type: 'error',
                        size: 'small'
                    },
                    style: {
                        marginRight: '10px',
                        marginTop: '10px',
                        marginBottom: '10px',
                    },
                    on: {
                        click: () => {
                            component.$Modal.warning({
                                title: "tips",
                                content: "are you ready to delete?",
                                okText: "YES",
                                onOk: function () {
                                    const cur_line_index = params.index;
                                    vue_data[data_name].is_in_opt = true;
                                    vue_data[data_name].opt_name = "delete";
                                    vue_data[data_name].opt_line = cur_line_index;
                                    const cur_line_data = vue_data[data_name].data[cur_line_index];
                                    cur_line_data['did'] = vue_data.designer_data_directory.cur_selected.id;
                                    opt_data(cur_line_data);
                                },
                                closable: true,
                                onCancel: function () {

                                },
                                cancelText: ""
                            });

                        }
                    }
                }, 'delete'));
            }
            return h('div', div_data);
        }
    };
}

vue_data.data_struct = {
    show: false,
    columns: [
        editable_table_common_column("data_struct", "code", "code"),
        editable_table_common_column("data_struct", "meaning", "meaning"),
        editable_table_common_column("data_struct", "reference_type", "reference_type"),
        editable_table_common_operation_column("data_struct"),
    ],
    data: [],
    data_line_backup: {},
    loading: false,
    is_in_opt: false,
    opt_name: "",
    opt_line: -1,
    associate: {
        io: {
            "set": [],
            "get": [],
        },
        trigger: {
            "insert": [],
            "update": [],
            "delete": [],
        },
    },
    data_event_2_logic: {
        cur_choose: {
            value: [],
            logic_id: "",
            func_name: "",
        },
        data: [],
    },
};
vue_methods.data_struct = {
    do_query_designer_data_struct: async function () {
        await query_designer_data_struct();
    },
    do_insert_designer_data_struct: async function () {
        trigger_insert_designer_data_struct();
    }
};


async function trigger_insert_designer_data_struct() {
    // data struct must on one data directory
    if (!vue_data.designer_data_directory.cur_selected.id || vue_data.designer_data_directory.cur_selected.id == "") {
        component.$Message.error("this operation must after the valid data directory selected");
        return;
    }
    // can not continuous multiple times add/update
    if (vue_data.data_struct.is_in_opt) {
        component.$Message.error("can not continuous multiple times add/update");
        return;
    }
    vue_data.data_struct.is_in_opt = true;
    vue_data.data_struct.opt_name = "insert";

    // construct column
    const temp_data_one = {};
    for (const item of vue_data.data_struct.columns) {
        const key = item["key"];
        if (key && key != "") {
            temp_data_one[key] = "";
        }
    }
    vue_data.data_struct.opt_line = vue_data.data_struct.data.length;
    vue_data.data_struct.data.push(temp_data_one);
}

async function cancel_opt_data() {
    const opt_name = vue_data.data_struct.opt_name;
    if ("insert" == opt_name) {
        vue_data.data_struct.data.pop();
    } else if ("update" == opt_name) {
        // 还原
        vue_data.data_struct.is_in_opt = false;
        vue_data.data_struct.opt_name = "";
        const cur_line = vue_data.data_struct.opt_line;
        vue_data.data_struct.opt_line = -1;
        vue_data.data_struct.data[cur_line] = vue_data.data_struct.data_line_backup;
    }
    vue_data.data_struct.is_in_opt = false;
    vue_data.data_struct.opt_name = "";
    vue_data.data_struct.opt_line = -1;
}

async function opt_data(cur_line_data) {
    // operation type
    const opt_name = vue_data.data_struct.opt_name;
    let request_data = {};
    if ("insert" == opt_name) {
        insert_designer_data_struct(cur_line_data);
    } else if ("update" == opt_name) {
        update_designer_data_struct(cur_line_data);
    } else if ("delete" == opt_name) {
        delete_designer_data_struct(cur_line_data);
    }
}

async function query_designer_data_logic_associate() { // designer_data_logic_io & designer_data_logic_trigger
    try {
        vue_data.data_struct.associate.io.set = [];
        vue_data.data_struct.associate.io.get = [];
        vue_data.data_struct.associate.trigger.insert = [];
        vue_data.data_struct.associate.trigger.update = [];
        vue_data.data_struct.associate.trigger.delete = [];

        const did = vue_data.designer_data_directory.cur_selected.id;
        const parameters = {
            "did": did,
        }
        let net_request_result;
        // designer_data_logic_io
        net_request_result = await do_execute_sql({
            "sql": `
                select data_id, logic_id, type
                from designer_data_logic_io
                where data_id = %(did)s
            `,
            "parameters": parameters,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        for (const item of net_request_result.data) {
            vue_data.data_struct.associate.io[item["type"]].push(item["logic_id"]);
        }
        // designer_data_logic_trigger
        net_request_result = await do_execute_sql({
            "sql": `
                select data_id, logic_id, func_name, type
                from designer_data_logic_trigger
                where data_id = %(did)s
            `,
            "parameters": parameters,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        for (const item of net_request_result.data) {
            vue_data.data_struct.associate.trigger[item["type"]].push(item["logic_id"] + ":" + item["func_name"]);
        }
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}

async function query_designer_data_struct() {
    try {
        await cancel_opt_data();
        // prepare data struct data
        const data_struct = {"did": vue_data.designer_data_directory.cur_selected.id};
        // query data_struct from distribution
        const net_request_result = await do_execute_sql({
            "sql": `
                select id, code, meaning, reference_type
                from designer_data_struct
                where did = %(did)s
            `,
            "parameters": data_struct,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        vue_data.data_struct.data = net_request_result.data;
        if (vue_data.data_data) { // init the data_data
            vue_data.data_data.column_keys = [];
            vue_data.data_data.columns = [];
            vue_data.data_data.search.template = []; // search from template

            editable_table_common_column_width = calculate_table_column_width(vue_data.data_struct.data.length);
            for (const item of vue_data.data_struct.data) {
                const code = item["code"];
                const meaning = item["meaning"];
                vue_data.data_data.column_keys.push(code);
                vue_data.data_data.columns.push(editable_table_common_column("data_data", meaning, code));
                vue_data.data_data.search.template.push({"label": meaning, "prop": code, "v_model": ""});
            }
        }
        component.$Message.success('query data_struct success');
        await query_designer_data_logic_associate();
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}

async function insert_designer_data_struct(data_struct) {
    try {
        let net_request_result = null;

        // alter data table add column
        const db_data = {
            "did": data_struct["did"],
            "column": data_struct["code"],
            "comment": data_struct["meaning"],
            "reference_type": data_struct["reference_type"],
        };
        let sql = `
                ALTER TABLE designer_data_data_{{did}} ADD COLUMN {{column}} VARCHAR(255) DEFAULT NULL COMMENT '{{comment}}';
                `.format(db_data);
        net_request_result = await do_execute_sql({
            "sql": sql,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        // query data_struct from distribution
        net_request_result = await do_execute_sql({
            "sql": `
                insert into designer_data_struct(did, code, meaning,reference_type ) values ({{did}},'{{code}}','{{meaning}}','{{reference_type}}')
                `.format(data_struct),
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;

        component.$Message.success('insert data_struct success');
        await query_designer_data_struct();
    } catch (e) {
        console.log(e.response.data);
        component.$Message.error(e.response.data);
    }
}

async function update_designer_data_struct(data_struct) {
    try {
        let net_request_result = null;

        // alter data table change column
        const db_data = {
            "did": data_struct["did"],
            "column_old": vue_data.data_struct.data_line_backup["code"],
            "column": data_struct["code"],
            "comment": data_struct["meaning"],
        };
        net_request_result = await do_execute_sql({
            "sql": `
                ALTER TABLE designer_data_data_{{did}} change {{column_old}} {{column}} VARCHAR(255) DEFAULT NULL COMMENT '{{comment}}';
                `.format(db_data),
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;

        // query data_struct from distribution
        net_request_result = await do_execute_sql({
            "sql": `
                update designer_data_struct set code = '{{code}}',meaning = '{{meaning}}' where id = {{id}}
                `.format(data_struct),
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        console.log(vue_data.data_struct.data_line_backup);

        component.$Message.success('update data_struct success');
        await query_designer_data_struct();
    } catch (e) {
        console.log(e.response.data);
        component.$Message.error(e.response.data);
    }
}

async function delete_designer_data_struct(data_struct) {
    try {
        let net_request_result = null;

        // alter data table delete column
        const db_data = {
            "did": data_struct["did"],
            "column": data_struct["code"],
        };
        net_request_result = await do_execute_sql({
            "sql": `
                ALTER TABLE designer_data_data_{{did}} drop {{column}};
                `.format(db_data),
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;

        // query data_struct from distribution
        net_request_result = await do_execute_sql({
            "sql": `
                delete from designer_data_struct where id = {{id}}
                `.format(data_struct),
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;

        component.$Message.success('delete data_struct success');
        await query_designer_data_struct();
    } catch (e) {
        console.log(e.response.data);
        component.$Message.error(e.response.data);
    }
}


// TODO improvement: increase the multi data_struct flow

function calculate_table_column_width(column_number) {
    const window_width = document.documentElement.clientWidth;
    const right_window_width = window_width * (1 - vue_data.split);
    let nav_area_width = 10;
    let table_column_operation_status_width_temp = 0;
    if (!vue_data.data_data) {
        nav_area_width = 43;
    } else {
        table_column_operation_status_width_temp = table_column_operation_status_width;
    }
    return (right_window_width - editable_table_common_operation_column_width - table_column_operation_status_width_temp - nav_area_width) / column_number;
}