const update_description_btn_str = "update description";
const save_description_btn_str = "save description";

vue_data.designer_data_directory = {
    tree: [],
    cur_selected: {
        name: "",
        id: "",
        description: "",
        description_disabled: true,
        description_btn_name: update_description_btn_str,
    },
};
vue_methods.designer_data_directory = {
    do_update_designer_data_directory__description: function () {
        update_designer_data_directory__description();
    },
};

function init_designer_data_directory_tree_view() {
    layui.use(['tree', 'util'], function () {
        const tree = layui.tree;
        let tree_edit_data = ['add', 'update', 'del'];
        if (vue_data.data_data) {
            tree_edit_data = [];
        }
        tree.render({
            elem: '#designer_data_directory_tree'
            , data: vue_data.designer_data_directory.tree
            , id: 'designer_data_directory'
            , edit: tree_edit_data
            , click: async function (obj) {
                const id = obj.data.id;
                // set the breadcrumb
                vue_data.breadcrumb.list = [];
                const cur_level_str = obj.data.cur_level_str;
                if (cur_level_str) {
                    vue_data.breadcrumb.list = cur_level_str.split(",");
                }
                // set the directory id
                vue_data.breadcrumb.cur_selected_id = "";
                if (id) {
                    vue_data.breadcrumb.cur_selected_id = id;
                }
                if (!id) {
                    return;
                }

                const name = obj.data.title;
                vue_data.designer_data_directory.cur_selected.name = name;
                vue_data.designer_data_directory.cur_selected.id = id;
                vue_data.designer_data_directory.cur_selected.description = obj.data.description;

                // just now support for one pane for every type
                const tab_pane_id = id;
                for (const index in vue_data.tab_pane) {
                    const item = vue_data.tab_pane[index];
                    if (item['type'] == 'data' && item['name'] == id) {
                        return;
                    }
                    vue_data.tab_pane.splice(index, 1);
                    break;
                }
                vue_data.tab_pane.push({
                    'type': 'data',
                    'name': tab_pane_id,
                    'label': name,
                    'visible': true,
                    'icon': 'md-albums',
                });
                vue_data.tab_pane_cur = vue_data.tab_pane.length - 1;
                if (vue_data.data_struct) {
                    await vue_methods.data_struct.do_query_designer_data_struct();
                }
                if (vue_data.data_data) {
                    await vue_methods.data_data.do_query_designer_data_data();
                }
            }
            , operate: function (obj) {
                const type = obj.type;
                if (type === 'add') {
                    add_designer_data_directory(obj)
                } else if (type === 'update') {
                    update_designer_data_directory(obj)
                } else if (type === 'del') {
                    delete_designer_data_directory(obj)
                }
            }
        });
    });
}

async function init_designer_data_directory() {
    try {
        // query designer_data_directory from distribution
        const net_request_result = await do_execute_sql({
            "sql": `
                select id, pid, name, description
                from designer_data_directory
            `,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        let original_tree_list = net_request_result.data;
        // adapter list to tree
        const name_str = "title";
        const description_str = "description";
        const children_str = "children";

        function setup_tree(pid, parent_level_str) {
            const cur_tree_level = [];
            let i = original_tree_list.length;
            while (i--) {
                const originalTreeListElement = original_tree_list[i];
                if (originalTreeListElement["pid"] == pid) {
                    original_tree_list.splice(i, 1);
                    const cur_level_str = parent_level_str + "," + originalTreeListElement["name"];
                    const next_tree_level = setup_tree(originalTreeListElement["id"], cur_level_str);
                    const cur_tree_data = originalTreeListElement;
                    cur_tree_data["cur_level_str"] = cur_level_str;
                    cur_tree_data[name_str] = originalTreeListElement["name"];
                    cur_tree_data[description_str] = originalTreeListElement[description_str];
                    cur_tree_data["spread"] = true;
                    if (next_tree_level.length > 0) {
                        cur_tree_data[children_str] = next_tree_level;
                    }
                    cur_tree_level.push(cur_tree_data);
                }
            }
            return cur_tree_level;
        }

        const tree_data = setup_tree(null, '');
        vue_data.designer_data_directory.tree = [{"title": "home", "children": tree_data, "spread": true, "id": null}];
        init_designer_data_directory_tree_view();
        component.$Message.success('query data_directory success');
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}


async function add_designer_data_directory(obj) {
    try {
        // prepare data directory data
        const designer_data_directory = {"pid": obj.data.id, name: ""};
        // save to distribution
        let net_request_result = await do_execute_sql({
            "sql": `
                insert into designer_data_directory(pid, name)
                values (%(pid)s, %(name)s)
            `,
            "parameters": designer_data_directory,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        // create a data table
        const db_data = {
            "id": net_request_result.data
        };
        net_request_result = await do_execute_sql({
            "sql": `
                CREATE TABLE designer_data_data_{{id}} (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    PRIMARY KEY (id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `.format(db_data),
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        component.$Message.success('add data_directory success');
        await init_designer_data_directory();
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}

async function update_designer_data_directory(obj) {
    try {
        // prepare data directory data
        const designer_data_directory = {
            "id": obj.data.id,
            "name": obj.data.title,
        };
        // save to distribution
        const net_request_result = await do_execute_sql({
            "sql": `
                update designer_data_directory
                set name = %(name)s
                where id = %(id)s
            `,
            "parameters": designer_data_directory,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        component.$Message.success('update data_directory success');
        await init_designer_data_directory();
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}

async function delete_designer_data_directory(obj) {
    try {
        let net_request_result;

        // drop a data table
        const db_data = {
            "id": obj.data.id
        };
        net_request_result = await do_execute_sql({
            "sql": `
                drop table designer_data_data_{{id}}
                `.format(db_data),
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;

        // prepare data directory data
        const designer_data_directory = {
            "id": obj.data.id,
        };
        if (obj.data.children) {
            component.$Message.error("this data directory has children");
            await init_designer_data_directory();
            return;
        }
        // save to distribution
        net_request_result = await do_execute_sql({
            "sql": `
                delete
                from designer_data_directory
                where id = %(id)s
            `,
            "parameters": designer_data_directory,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;

        component.$Message.success('delete data_directory success');
        // close the data struct
        vue_data.data_struct.show = false;
        await init_designer_data_directory();
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}

async function update_designer_data_directory__description() {
    if (vue_data.designer_data_directory.cur_selected.description_disabled) {
        vue_data.designer_data_directory.cur_selected.description_disabled = false;
        vue_data.designer_data_directory.cur_selected.description_btn_name = save_description_btn_str;
        return;
    }
    vue_data.designer_data_directory.cur_selected.description_disabled = true;
    vue_data.designer_data_directory.cur_selected.description_btn_name = update_description_btn_str;
    try {
        // prepare data directory data
        const designer_data_directory = {
            "id": vue_data.designer_data_directory.cur_selected.id,
            "description": vue_data.designer_data_directory.cur_selected.description,
        };
        // save to distribution
        const net_request_result = await do_execute_sql({
            "sql": `
                update designer_data_directory
                set description = %(description)s
                where id = %(id)s
            `,
            "parameters": designer_data_directory,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        component.$Message.success('update data_directory__description success');
        vue_data.designer_data_directory.cur_selected.description_disabled = true;
        await init_designer_data_directory();
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}

// TODO improvement: support the open multi tab on center window, not that not cause bug

// TODO improvement: support version and fork operation for every data
