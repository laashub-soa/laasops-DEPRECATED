vue_data.designer_logic_directory = {
    tree: [],
    cur_selected: {
        name: "",
        id: "",
    },
};

function init_designer_logic_directory_tree_view() {
    layui.use(['tree', 'util'], function () {
        const tree = layui.tree;
        tree.render({
            elem: '#designer_logic_directory_tree'
            , data: vue_data.designer_logic_directory.tree
            , edit: ['add', 'update', 'del']
            , click: function (obj) {
                const id = obj.data.id;
                const name = obj.data.title;
                vue_data.designer_logic_directory.cur_selected.name = name;
                vue_data.designer_logic_directory.cur_selected.id = id;
                if (!id) {
                    return;
                }
                // just now support for one pane for every type
                const tab_pane_id = id;
                for (const index in vue_data.tab_pane) {
                    const item = vue_data.tab_pane[index];
                    if (item['type'] == 'logic' && item['name'] == id) {
                        return;
                    }
                    vue_data.tab_pane.splice(index, 1);
                    break;
                }
                vue_data.tab_pane.push({
                    'type': 'logic',
                    'name': tab_pane_id,
                    'label': name,
                    'visible': true,
                    'icon': 'md-cog',
                });
                vue_data.tab_pane_cur = vue_data.tab_pane.length - 1;
                // init the designer_logic_data
                init_designer_logic_data_file_view();
            }
            , operate: function (obj) {
                const type = obj.type;
                if (type === 'add') {
                    add_designer_logic_directory(obj)
                } else if (type === 'update') {
                    update_designer_logic_directory(obj)
                } else if (type === 'del') {
                    delete_designer_logic_directory(obj)
                }
            }
        });
    });
}

async function init_designer_logic_directory() {
    try {
        // query designer_logic_directory from distribution
        const net_request_result = await do_execute_sql({
            "sql": `
                select id,pid,name,description from designer_logic_directory
                `,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        let original_tree_list = net_request_result.data;
        // adapter list to tree
        const name_str = "title";
        const children_str = "children";

        function setup_tree(pid) {
            const cur_tree_level = [];
            let i = original_tree_list.length;
            while (i--) {
                const originalTreeListElement = original_tree_list[i];
                if (originalTreeListElement["pid"] == pid) {
                    original_tree_list.splice(i, 1);
                    const next_tree_level = setup_tree(originalTreeListElement["id"]);
                    const cur_tree_data = originalTreeListElement;
                    cur_tree_data[name_str] = originalTreeListElement["name"];
                    cur_tree_data["spread"] = true;
                    if (next_tree_level.length > 0) {
                        cur_tree_data[children_str] = next_tree_level;
                    }
                    cur_tree_level.push(cur_tree_data);
                }
            }
            return cur_tree_level;
        }

        const tree_data = setup_tree(null);
        vue_data.designer_logic_directory.tree = [{"title": "home", "children": tree_data, "spread": true, "id": null}];
        init_designer_logic_directory_tree_view();
        component.$Message.success('query success');
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}


async function add_designer_logic_directory(obj) {
    try {
        let net_request_result;
        // prepare data directory data
        const designer_logic_directory = {"pid": obj.data.id, name: ""};
        // save to distribution
        net_request_result = await do_execute_sql({
            "sql": `
                insert into designer_logic_directory(pid,name) values ({{pid}},'{{name}}')
                `.format(designer_logic_directory),
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        // designer_logic_data
        const designer_logic_data = {"did": net_request_result.data, file: ""};
        net_request_result = await do_execute_sql({
            "sql": `
                insert into designer_logic_data(did, file) values (%(did)s, %(file)s)
                `,
            "parameters": designer_logic_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;

        component.$Message.success('add success');
        await init_designer_logic_directory();
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}

async function update_designer_logic_directory(obj) {
    try {
        // prepare data directory data
        const designer_logic_directory = {
            "id": obj.data.id,
            "name": obj.data.title,
        };
        // save to distribution
        const net_request_result = await do_execute_sql({
            "sql": `
                update designer_logic_directory set name = '{{name}}' where id = {{id}}
                `.format(designer_logic_directory),
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
        component.$Message.success('update success');
        await init_designer_logic_directory();
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}

async function delete_designer_logic_directory(obj) {
    try {
        let net_request_result;

        // designer_logic_data
        const designer_logic_data = {"did": obj.data.id};
        net_request_result = await do_execute_sql({
            "sql": `
                delete from designer_logic_data where did = %(did)s
                `,
            "parameters": designer_logic_data,
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;


        // designer_logic_directory
        const designer_logic_directory = {
            "id": obj.data.id,
        };
        if (obj.data.children) {
            component.$Message.error("this data directory has children");
            await init_designer_logic_directory();
            return;
        }
        net_request_result = await do_execute_sql({
            "sql": `
                delete from designer_logic_directory where id = {{id}}
                `.format(designer_logic_directory),
        });
        if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;

        component.$Message.success('delete success');
        // close the data struct
        vue_data.data_struct.show = false;
        await init_designer_logic_directory();
    } catch (e) {
        console.log(e);
        component.$Message.error(e.response.data);
    }
}