<template>
  <div>
    <button @click="addNode">Add Node</button>
    <vue-tree-list
      @click="onClick"
      @change-name="onChangeName"
      @delete-node="onDel"
      @add-node="onAddNode"
      :model="data"
      default-tree-node-name="new node"
      default-leaf-node-name="new leaf"
      v-bind:default-expanded="true">
    </vue-tree-list>
    <button @click="getNewTree">Get new tree</button>
    <pre>
      {{newTree}}
    </pre>
  </div>
</template>

<script>
    import {Tree, TreeNode, VueTreeList} from 'vue-tree-list'
    import request from "../../../../request.js";

    export default {
        name: "DesignerDataDirectory",
        components: {
            VueTreeList
        },
        data() {
            return {
                tree: [],
                newTree: {},
                data: new Tree([
                    {
                        name: 'Node 1',
                        id: 1,
                        pid: 0,
                        // dragDisabled: true,
                        children: [
                            {
                                name: 'Node 1-2',
                                id: 2,
                                isLeaf: true,
                                pid: 1
                            }
                        ]
                    },
                    {
                        name: 'Node 3',
                        id: 4,
                        pid: 0
                    }
                ])
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
                    //     if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
                    //     let original_tree_list = net_request_result.data;
                    //     // adapter list to tree
                    //     const name_str = "title";
                    //     const description_str = "description";
                    //     const children_str = "children";
                    //
                    //     function setup_tree(pid, parent_level_str) {
                    //         const cur_tree_level = [];
                    //         let i = original_tree_list.length;
                    //         while (i--) {
                    //             const originalTreeListElement = original_tree_list[i];
                    //             if (originalTreeListElement["pid"] == pid) {
                    //                 original_tree_list.splice(i, 1);
                    //                 const cur_level_str = parent_level_str + "," + originalTreeListElement["name"];
                    //                 const next_tree_level = setup_tree(originalTreeListElement["id"], cur_level_str);
                    //                 const cur_tree_data = originalTreeListElement;
                    //                 cur_tree_data["cur_level_str"] = cur_level_str;
                    //                 cur_tree_data[name_str] = originalTreeListElement["name"];
                    //                 cur_tree_data[description_str] = originalTreeListElement[description_str];
                    //                 cur_tree_data["spread"] = true;
                    //                 if (next_tree_level.length > 0) {
                    //                     cur_tree_data[children_str] = next_tree_level;
                    //                 }
                    //                 cur_tree_level.push(cur_tree_data);
                    //             }
                    //         }
                    //         return cur_tree_level;
                    //     }
                    //
                    //     const tree_data = setup_tree(null, '');
                    //     this.tree = [{
                    //         "title": "home",
                    //         "children": tree_data,
                    //         "spread": true,
                    //         "id": null
                    //     }];
                    //     this.$Message.success('query data_directory success');
                } catch (e) {
                    console.log(e);
                    // if (e.response && e.response.data) {
                    //     this.$Message.error(e.response.data);
                    // }
                    // this.$Message.error(e);
                }
            },
            async init_tree_view() {

            },
            onDel(node) {
                console.log(node)
                node.remove()
            },

            onChangeName(params) {
                console.log(params)
            },

            onAddNode(params) {
                console.log(params)
            },

            onClick(params) {
                console.log(params)
            },

            addNode() {
                var node = new TreeNode({name: 'new node', isLeaf: false})
                if (!this.data.children) this.data.children = []
                this.data.addChildren(node)
            },

            getNewTree() {
                var vm = this

                function _dfs(oldNode) {
                    var newNode = {}

                    for (var k in oldNode) {
                        if (k !== 'children' && k !== 'parent') {
                            newNode[k] = oldNode[k]
                        }
                    }

                    if (oldNode.children && oldNode.children.length > 0) {
                        newNode.children = []
                        for (var i = 0, len = oldNode.children.length; i < len; i++) {
                            newNode.children.push(_dfs(oldNode.children[i]))
                        }
                    }
                    return newNode
                }

                vm.newTree = _dfs(vm.data)
            },
        },
        async created() {
            await this.init_designer_data_directory();
        },

    }

</script>

<style scoped>
  @import '~view-design/dist/styles/iview.css';
</style>
<style lang="less" rel="stylesheet/less">
  .vtl {
    .vtl-drag-disabled {
      background-color: #d0cfcf;

      &:hover {
        background-color: #d0cfcf;
      }
    }

    .vtl-disabled {
      background-color: #d0cfcf;
    }
  }
</style>

<style lang="less" rel="stylesheet/less" scoped>
  .icon {
    &:hover {
      cursor: pointer;
    }
  }
</style>
