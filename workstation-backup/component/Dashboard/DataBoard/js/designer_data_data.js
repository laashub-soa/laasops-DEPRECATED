// TODO improvement: memory table column width for open again
function memory_data_data_table_column_width() {

}

// TODO improvement: lock button on table column, click it can make the column fix to left
function lock_data_data_table_column() {

}

function table_column_operation_status(data_name) {
    return {
        title: 'operation-status',
        slot: 'operation-status',
        align: 'center',
        width: table_column_operation_status_width,
        resizable: true,
        render: (h, params) => {
            const div_data = [];
            // event_type:current_status
            const data_status_data = vue_data[data_name].data_status[params.index];
            const data_status = data_status_data["status"];
            let primary_str = "info";
            if ("FINISH" == data_status) {
                primary_str = "success";
            } else {
                primary_str = "error";
            }
            div_data.push(h('Button', {
                props: {
                    type: primary_str,
                    size: 'small'
                },
                style: {
                    marginRight: '10px',
                    marginTop: '10px',
                    marginBottom: '10px',
                },
            }, data_status_data["data_event_type"] + ":" + data_status));
            // Details
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
                    click: async () => {
                        // gen data status details tree data
                        vue_data.data_data.data_status_details.display = true;
                        const data_data_id = vue_data.data_data.data[params.index]["id"];
                        await init_engine_data_logic_trigger_data_status_details_status_tree(data_data_id);
                        await query_engine_data_logic_trigger_data_status_details_log("tree", {"data_data_id": data_data_id});
                    }
                }
            }, 'Details'));
            // Pause
            // Resume
            // Delay
            // GiveUp
            // TODO improvement: support the Pause/Resume/Delay/GiveUp operation


            return h('div', div_data);
        }
    };
}

vue_data.data_data = {
    show: false,
    columns: [],
    data: [],
    data_status: [],
    data_status_details: {
        display: false,
        tree: [],
        log_list: [],
    },
    data_line_backup: {},
    loading: false,
    is_in_opt: false,
    opt_name: "",
    opt_line: -1,
    page: {
        current: 1,
        total: 0,
        page_size: 10
    },
    search: {
        expand_status: false,
        data: {},
        template: [],
    },
};
vue_methods.data_data = {
    async do_query_designer_data_data() {
        await query_designer_data_data();
    },
    async do_insert_designer_data_data() {
        await trigger_insert_designer_data_data();
    },
    async search() {
        await query_designer_data_data();
    },
};


async function trigger_insert_designer_data_data() {
    // data struct must on one data directory
    if (!vue_data.designer_data_directory.cur_selected.id || vue_data.designer_data_directory.cur_selected.id == "") {
        component.$Message.error("this operation must after the valid data directory selected");
        return;
    }
    // can not continuous multiple times add/update
    if (vue_data.data_data.is_in_opt) {
        component.$Message.error("can not continuous multiple times add/update");
        return;
    }
    vue_data.data_data.is_in_opt = true;
    vue_data.data_data.opt_name = "insert";

    // construct column
    const temp_data_one = {};
    for (const item of vue_data.data_data.columns) {
        const key = item["key"];
        if (key && key != "") {
            temp_data_one[key] = "";
        }
    }
    vue_data.data_data.opt_line = vue_data.data_data.data.length;
    vue_data.data_data.data.push(temp_data_one);
}

async function cancel_opt_data() {
    const opt_name = vue_data.data_data.opt_name;
    if ("insert" == opt_name) {
        vue_data.data_data.data.pop();
    } else if ("update" == opt_name) {
        // 还原
        vue_data.data_data.is_in_opt = false;
        vue_data.data_data.opt_name = "";
        const cur_line = vue_data.data_data.opt_line;
        vue_data.data_data.opt_line = -1;
        vue_data.data_data.data[cur_line] = vue_data.data_data.data_line_backup;
    }
    vue_data.data_data.is_in_opt = false;
    vue_data.data_data.opt_name = "";
    vue_data.data_data.opt_line = -1;
}

async function opt_data(cur_line_data) {
    // operation type
    const opt_name = vue_data.data_data.opt_name;
    if (await consider_data_event_need_logic_func())
        if (!await choose_logic_func_4_data_event()) return;
    if ("insert" == opt_name) {
        insert_designer_data_data(cur_line_data);
    } else if ("update" == opt_name) {
        update_designer_data_data(cur_line_data);
    } else if ("delete" == opt_name) {
        delete_designer_data_data(cur_line_data);
    }
}

async function query_designer_data_data() {
    try {
        vue_data.data_data.data = [];
        if (!vue_data.data_data.column_keys || vue_data.data_data.column_keys.length <= 0) return;
        await cancel_opt_data();
        // prepare data struct data
        const data_data = {"did": vue_data.designer_data_directory.cur_selected.id};
        let net_request_result;
        let sql = "select {{columns}} from designer_data_data_{{did}}";
        // search
        let has_search_condition = false;

        for (const item of vue_data.data_data.search.template) {
            const prop = item["prop"];
            const v_model = item["v_model"];
            if (!v_model || v_model == "") continue;
            if (!has_search_condition) {
                sql += " WHERE 1=1 ";
                has_search_condition = true;
            }
            sql += " and " + prop + " LIKE %(search_" + prop + ")s ";
            data_data["search_" + prop] = "%" + v_model + "%";
        }
        // page
        data_data.columns = "count(1)";
        net_request_result = await do_execute_sql({
            "sql": sql.format(data_data),
            "parameters": data_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        let total = net_request_result.data[0];
        vue_data.data_data.page.total = total[Object.keys(total)[0]];
        // LIMIT offset, length
        const sql_page = " LIMIT " + ((vue_data.data_data.page.current - 1) * vue_data.data_data.page.page_size) + ", " + vue_data.data_data.page.page_size;

        // query
        data_data.columns = "id, " + vue_data.data_data.column_keys.join(",");

        sql = sql.format(data_data);
        net_request_result = await do_execute_sql({
            "sql": sql + sql_page,
            "parameters": data_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        vue_data.data_data.data = net_request_result.data;
        component.$Message.success('query data_data success');
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
    await query_engine_data_logic_trigger_data_status_status_and_data_event_type();
    vue_data.data_data.columns.push(editable_table_common_operation_column("data_data"));
    vue_data.data_data.columns.push(null);
    vue_data.data_data.columns.pop();
    vue_data.data_data.columns.push(table_column_operation_status("data_data"));
}

async function consider_data_event_need_logic_func() {
    if (vue_data.data_struct.associate.trigger[vue_data.data_data.opt_name].length > 0) return true;
    return false;
}

async function choose_logic_func_4_data_event() {
    // convert trigger data
    vue_data.data_struct.data_event_2_logic.data = [];
    for (const item of vue_data.data_struct.associate.trigger[vue_data.data_data.opt_name]) {
        vue_data.data_struct.data_event_2_logic.data.push({
            "value": item,
            "label": item,
        });
    }
    const result = await new Promise(function (resolve, reject) {
        component.$Modal.confirm({
            onOk: () => {
                if (!vue_data.data_struct.data_event_2_logic.cur_choose.value || vue_data.data_struct.data_event_2_logic.cur_choose.value == "") {
                    resolve(false);
                }
                resolve(true);
            },
            onCancel: () => {
                resolve(false);
            },
            render: (h) => {
                return h('cascader', {
                    props: {
                        "mask-closable": false,
                        value: vue_data.data_struct.data_event_2_logic.cur_choose.value,
                        data: vue_data.data_struct.data_event_2_logic.data,
                    },
                    on: {
                        'on-change': function (value, selectedData) {
                            vue_data.data_struct.data_event_2_logic.cur_choose.value = value;
                        }
                    },
                })
            }
        })
    });
    if (!result) {
        component.$Message.error("you must choose and logic_func when the data_event adapter an logic_func");
    }
    return result;
}

async function insert_designer_data_data(data_data) {
    try {
        let net_request_result;
        let sql_insert_columns = "";
        let sql_insert_values = "";
        for (const item of vue_data.data_data.column_keys) {
            sql_insert_columns += item + ",";
            sql_insert_values += "%(" + item + ")s,";
        }
        if (sql_insert_columns == "" || sql_insert_values == "") return;
        sql_insert_columns = sql_insert_columns.substring(0, sql_insert_columns.length - 1);
        sql_insert_values = sql_insert_values.substring(0, sql_insert_values.length - 1);
        let sql = ("insert into designer_data_data_{{did}}( " + sql_insert_columns + ") values (" + sql_insert_values + ")").format(data_data);
        net_request_result = await do_execute_sql({
            "sql": sql,
            "parameters": data_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        component.$Message.success('insert data_data success');
        await trigger_engine("insert", net_request_result.data);
        await query_designer_data_data();
    } catch (e) {
        console.log(e.response.data);
        component.$Message.error(e.response.data);
    }
}

async function update_designer_data_data(data_data) {
    try {
        let net_request_result;
        let sql_set = "";
        for (const item of vue_data.data_data.column_keys) {
            sql_set += item + "=%(" + item + ")s,";
        }
        if (sql_set == "") return;
        sql_set = sql_set.substring(0, sql_set.length - 1);

        let sql = ("update designer_data_data_{{did}} set " + sql_set + " where id = {{id}} ").format(data_data);
        net_request_result = await do_execute_sql({
            "sql": sql,
            "parameters": data_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        component.$Message.success('update data_data success');
        await trigger_engine("update", data_data["id"]);
        await query_designer_data_data();
    } catch (e) {
        console.log(e.response.data);
        component.$Message.error(e.response.data);
    }
}

async function delete_designer_data_data(data_data) {
    try {
        let net_request_result;
        let sql = ("delete from designer_data_data_{{did}} where id = {{id}} ").format(data_data);
        net_request_result = await do_execute_sql({
            "sql": sql,
            "parameters": data_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        component.$Message.success('delete data_data success');
        await trigger_engine("delete", data_data["id"]);
        await query_designer_data_data();
    } catch (e) {
        console.log(e.response.data);
        component.$Message.error(e.response.data);
    }
}

async function trigger_engine(type, data_data_id) { // insert, update, delete
    const data_id = vue_data.designer_data_directory.cur_selected.id;
    try {
        const request_data = {
            "data_id": data_id,
            "data_data_id": data_data_id,
            "type": type,
        };

        if (!vue_data.data_struct.data_event_2_logic.cur_choose.value || vue_data.data_struct.data_event_2_logic.cur_choose.value.length <= 0) return;
        const logic_func_name = vue_data.data_struct.data_event_2_logic.cur_choose.value[0];
        const logic_func_name_arr = logic_func_name.split(":");
        request_data["logic_id"] = logic_func_name_arr[0];
        request_data["func_name"] = logic_func_name_arr[1];
        const net_request_result = await do_trigger_engine(request_data);
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        component.$Message.success('trigger_engine success');
    } catch (e) {
        console.log(e.response.data);
        component.$Message.error(e.response.data);
    }
}

async function query_engine_data_logic_trigger_data_status_status_and_data_event_type() {
    try {
        const data_id = vue_data.designer_data_directory.cur_selected.id;
        if (!data_id || !vue_data.data_data.data || vue_data.data_data.data.length < 1) return;
        let data_data_data_id_list_str = "";
        for (const item of vue_data.data_data.data) {
            const data_data_id = item["id"];
            data_data_data_id_list_str += "'" + data_id + "_" + data_data_id + "', ";
        }
        data_data_data_id_list_str = data_data_data_id_list_str.substring(0, data_data_data_id_list_str.length - 2);
        let net_request_result = await do_execute_sql({
            "sql": `
                    select t1.status, t1.data_event_type, t1.data_data_id
                    from(
                        select max(id) as id, concat(data_id,'_',data_data_id) as data_data_data_id
                        from engine_data_logic_trigger_data_status
                        group by data_id, data_data_id
                    )t, engine_data_logic_trigger_data_status t1
                    where t.data_data_data_id in ({{data_data_data_id_list_str}})
                    and t.id = t1.id
                `.format({
                "data_data_data_id_list_str": data_data_data_id_list_str,
            })
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return null;
        vue_data.data_data.data_status = net_request_result.data;
        component.$Message.success("query table's data status success");
    } catch (e) {
        console.log(e.response.data);
        component.$Message.error(e.response.data);
    }
}

async function init_engine_data_logic_trigger_data_status_details_status_tree(data_data_id) {
    await query_engine_data_logic_trigger_data_status_details_status(data_data_id);
    layui.use(['tree', 'util'], function () {
        layui.tree.render({
            elem: '#engine_data_logic_trigger_data_status_details_status_tree'
            , data: vue_data.data_data.data_status_details.tree
            , showLine: false
            , click: async function (obj) {
                await query_engine_data_logic_trigger_data_status_details_log(obj.data.tree_level_type, obj.data.tree_level_data);
            }
        });
    });
}

async function query_engine_data_logic_trigger_data_status_details_status(data_data_id) {
    try {
        vue_data.data_data.data_status_details.tree = [];
        const data_id = vue_data.designer_data_directory.cur_selected.id;
        if (!data_id) return;
        let net_request_result = await do_execute_sql({
            "sql": `
                select id,
                       data_id,
                       data_data_id,
                       data_event_type,
                       logic_id,
                       func_name,
                       DATE_FORMAT(create_time, '%%Y-%%m-%%d %%T') as create_time_str,
                       status
                from engine_data_logic_trigger_data_status
                where data_id = %(data_id)s and data_data_id = %(data_data_id)s
                order by id asc
            `,
            "parameters": {
                "data_id": data_id,
                "data_data_id": data_data_id,
            },
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return null;
        const net_request_result_data = net_request_result.data;

        `
data_event:1(1):insert:(time)
    logic:1:test:(time)
        START:(time)
        RUNNING:(time)
        FINISH:(time)
        `
        let last_data_even_type = "";
        let tree_level_data_event;
        let tree_level_logic_children;
        while (net_request_result_data.length > 0) {
            let item = net_request_result_data.splice(0, 1)[0];
            const data_event_type = item["data_event_type"];
            if (last_data_even_type != data_event_type) {
                last_data_even_type = data_event_type;
                tree_level_logic_children = [];
                if (tree_level_data_event) {
                    vue_data.data_data.data_status_details.tree.push(tree_level_data_event);
                }
                tree_level_data_event = null;
            }
            if (!tree_level_data_event) {
                tree_level_data_event = {
                    "title": "data_event:{{data_id}}({{data_data_id}}):{{data_event_type}}:({{create_time_str}})".format(item),
                    "tree_level_type": "data_event",
                    "tree_level_data": item,
                    "spread": true,
                    "children": [{
                        "title": "logic:{{logic_id}}:{{func_name}}:({{create_time_str}})".format(item),
                        "tree_level_type": "logic",
                        "tree_level_data": item,
                        "spread": true,
                        "children": tree_level_logic_children,
                    }]
                };
            }
            tree_level_logic_children.push({
                "title": "{{status}}:({{create_time_str}})".format(item),
                "tree_level_type": "data_status",
                "tree_level_data": item,
            });
        }
        vue_data.data_data.data_status_details.tree.push(tree_level_data_event);
        component.$Message.success("query current rows's data status details status success");
    } catch (e) {
        console.log(e.response.data);
        component.$Message.error(e.response.data);
    }
}

async function query_engine_data_logic_trigger_data_status_details_log(tree_level_type, tree_level_data) {
    try {
        const data_id = vue_data.designer_data_directory.cur_selected.id;
        if (!data_id) return;
        tree_level_data["data_id"] = data_id;
        vue_data.data_data.data_status_details.log_list = [];
        let sql = `
                   select log
                   from engine_data_logic_trigger_data_log
                   where 1=1
                        and data_id = %(data_id)s
                        and data_data_id = %(data_data_id)s
        `;
        if ("tree" == tree_level_type) {
        } else if ("data_event" == tree_level_type) {
            sql += `
                    and data_event_type = %(data_event_type)s
            `
        } else if ("logic" == tree_level_type) {
            sql += `
                    and data_event_type = %(data_event_type)s
                    and logic_id = %(logic_id)s
                    and func_name = %(func_name)s
            `
        } else if ("data_status" == tree_level_type) {
            sql += `
                    and data_event_type = %(data_event_type)s
                    and logic_id = %(logic_id)s
                    and func_name = %(func_name)s
                    and create_time >= str_to_date(%(create_time_str)s, '%%Y-%%m-%%d %%T')
            `
        }
        let net_request_result = await do_execute_sql({
            "sql": sql,
            "parameters": tree_level_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return null;
        const net_request_result_data = net_request_result.data;
        for (const item of net_request_result_data) {
            vue_data.data_data.data_status_details.log_list.push(item["log"]);
        }
        component.$Message.success("query data status's precise log success");
    } catch (e) {
        console.log(e.response.data);
        component.$Message.error(e.response.data);
    }
}

// TODO bug: data operation need more check, there can be only operation at a time
// TODO improvement: insert/update/delete data operation when across the multi data, so it also need refactor the backend code

