<template>
  <div>
    <vue-tree-list
      :model="tree"
      default-tree-node-name="init_node"
      default-leaf-node-name="init_leaf"
      v-bind:default-expanded="true">
      <span class="icon" slot="addTreeNodeIcon">📂</span>
      <span class="icon" slot="editNodeIcon">📃</span>
      <span class="icon" slot="delNodeIcon">✂️</span>
      <span class="icon" slot="leafNodeIcon">🍃</span>
      <span class="icon" slot="treeNodeIcon">🌲</span>
    </vue-tree-list>

    <!--
    <vue-tree-list
      @click="onClick"
      @change-name="onChangeName"
      @delete-node="onDel"
      @add-node="onAddNode"
      :model="tree"
      default-tree-node-name="new node"
      default-leaf-node-name="new leaf"
      v-bind:default-expanded="false">
      <span class="icon" slot="addTreeNodeIcon">📂</span>
      <span class="icon" slot="addLeafNodeIcon">＋</span>
      <span class="icon" slot="editNodeIcon">📃</span>
      <span class="icon" slot="delNodeIcon">✂️</span>
      <span class="icon" slot="leafNodeIcon">🍃</span>
      <span class="icon" slot="treeNodeIcon">🌲</span>
    </vue-tree-list>

    -->
  </div>
</template>

<script>
    import {Tree, VueTreeList} from 'vue-tree-list'
    import request from "../../../../request.js";

    export default {
        name: "DesignerDataDirectory",
        components: {
            VueTreeList
        },
        data() {
            return {
                tree: [],
            }
        },
        methods: {
            async init_designer_data_directory() {
                try {
                    const net_request_result = await request.exec_sql(this, {
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
                    this.tree = [{
                        "title": "home",
                        "children": tree_data,
                        "spread": true,
                        "id": null
                    }];
                    this.$Message.success('query data_directory success');
                } catch (e) {
                    console.log(e);
                    if (e.response && e.response.data) {
                        this.$Message.error(e.response.data);
                    }
                    this.$Message.error(e);
                }
            },
            async init_tree_view() {


                // layui.use(['tree', 'util'], function () {
                //     const tree = layui.tree;
                //     let tree_edit_data = ['add', 'update', 'del'];
                //     // if (vue_data.data_data) tree_edit_data = [];
                //
                //     tree.render({
                //         elem: '#tree'
                //         , data: this._data.tree
                //         , id: 'tree'
                //         , edit: tree_edit_data
                //         , click: async function (obj) {
                //             const id = obj.data.id;
                //             // set the breadcrumb
                //             vue_data.breadcrumb.list = [];
                //             const cur_level_str = obj.data.cur_level_str;
                //             if (cur_level_str) {
                //                 vue_data.breadcrumb.list = cur_level_str.split(",");
                //             }
                //             // set the directory id
                //             vue_data.breadcrumb.cur_selected_id = "";
                //             if (id) {
                //                 vue_data.breadcrumb.cur_selected_id = id;
                //             }
                //             if (!id) {
                //                 return;
                //             }
                //
                //             const name = obj.data.title;
                //             vue_data.designer_data_directory.cur_selected.name = name;
                //             vue_data.designer_data_directory.cur_selected.id = id;
                //             vue_data.designer_data_directory.cur_selected.description = obj.data.description;
                //
                //             // just now support for one pane for every type
                //             const tab_pane_id = id;
                //             for (const index in vue_data.tab_pane) {
                //                 const item = vue_data.tab_pane[index];
                //                 if (item['type'] == 'data' && item['name'] == id) {
                //                     return;
                //                 }
                //                 vue_data.tab_pane.splice(index, 1);
                //                 break;
                //             }
                //             vue_data.tab_pane.push({
                //                 'type': 'data',
                //                 'name': tab_pane_id,
                //                 'label': name,
                //                 'visible': true,
                //                 'icon': 'md-albums',
                //             });
                //             vue_data.tab_pane_cur = vue_data.tab_pane.length - 1;
                //             if (vue_data.data_struct) {
                //                 await vue_methods.data_struct.do_query_designer_data_struct();
                //             }
                //             if (vue_data.data_data) {
                //                 await vue_methods.data_data.do_query_designer_data_data();
                //             }
                //         }
                //         , operate: function (obj) {
                //             const type = obj.type;
                //             if (type === 'add') {
                //                 add_designer_data_directory(obj)
                //             } else if (type === 'update') {
                //                 update_designer_data_directory(obj)
                //             } else if (type === 'del') {
                //                 delete_designer_data_directory(obj)
                //             }
                //         }
                //     });
                // });
            },
        },
        async created() {
            await this.init_designer_data_directory();
            // this._data.tree = new Tree({
            //     "id": 0,
            //     "isLeaf": false,
            //     "name": "root",
            //     "children": [
            //         {
            //             "id": 1,
            //             "isLeaf": false,
            //             "name": "Node 1",
            //             "pid": 0,
            //             "dragDisabled": true,
            //             "children": [
            //                 {
            //                     "id": 2,
            //                     "isLeaf": true,
            //                     "name": "Node 1-2",
            //                     "pid": 1
            //                 }
            //             ]
            //         },
            //         {
            //             "id": 3,
            //             "isLeaf": false,
            //             "name": "Node 2",
            //             "pid": 0,
            //             "disabled": true
            //         },
            //         {
            //             "id": 4,
            //             "isLeaf": false,
            //             "name": "Node 3",
            //             "pid": 0
            //         }
            //     ]
            // })

            await this.init_tree_view();
        }
    }

</script>

<style scoped>
  @import '~view-design/dist/styles/iview.css';
</style>

