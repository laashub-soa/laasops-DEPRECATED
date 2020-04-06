<template>
  <div>
    <Button @click="onAddNode(null)">Add Node</Button>
    <vue-tree-list
      @click="onClick"
      @change-name="onChangeName"
      @delete-node="onDel"
      @add-node="onAddNode"
      @drop="onDrop"
      :model="tree"
      default-tree-node-name="new node"
      default-leaf-node-name="new leaf"
      v-bind:default-expanded="true"
    >
    </vue-tree-list>
  </div>
</template>

<script>
    import {Tree, TreeNode, VueTreeList} from 'vue-tree-list'
    import designer_data_directory from './designer_data_directory.js'

    export default {
        name: "DesignerDataDirectory",
        components: {
            VueTreeList
        },
        data() {
            return {
                tree: new Tree([]),
                name: "",
                newTree: {},
            }
        },
        methods: {
            async onDel(node) {
                console.log(node)
                // save
                try {
                    const insert_result = await designer_data_directory.delete_designer_data_directory({
                        "id": node["id"],
                    });
                    this.$Message.success('delete data directory success');
                } catch (e) {
                    console.log(e);
                    this.$Message.error(e.response.data);
                }
                node.remove();
            },

            async onChangeName(params) {
                // TODO fix_bug: not every event need to response
                console.log(params)
                const input_name_result = params["newName"];
                if ("" == input_name_result) {
                    this.$Message.error("name can't be blank character");
                    return;
                }
                // save
                try {
                    const insert_result = await designer_data_directory.update_designer_data_directory({
                        "id": params["id"],
                        "name": input_name_result,
                    });
                    this.$Message.success('update data directory name success');
                } catch (e) {
                    console.log(e);
                    this.$Message.error(e.response.data);
                }
            },

            async onAddNode(params) {
                console.log(params);
                // make sure input data directory name
                const component = this;
                component._data.name = "";
                const input_name_result = await new Promise(function (resolve, reject) {
                    component.$Modal.confirm({
                        onOk: () => {
                            resolve(component._data.name);
                        },
                        onCancel: () => {
                            component._data.name = "";
                            resolve(component._data.name);
                        },
                        render: (h) => {
                            // TODO improvement: input box can autofocus
                            return h('Input', {
                                props: {
                                    autofocus: true,
                                    placeholder: 'Please enter directory name(a-z0-9_)...',
                                },
                                on: {
                                    input: (val) => {
                                        component._data.name = val;
                                    }
                                }
                            })
                        }
                    })
                });
                if ("" == input_name_result) return;
                // special for top level tree node
                if (!params) {
                    params = {name: input_name_result, pid: -1, isLeaf: false, addLeafNodeDisabled: true, children: []};
                    this._data.tree.addChildren(new TreeNode(params));
                } else {
                    params["addLeafNodeDisabled"] = true;
                    params["name"] = input_name_result;
                }
                // save
                try {
                    const insert_result = await designer_data_directory.insert_designer_data_directory({
                        "pid": params["pid"],
                        "name": params["name"],
                    });
                    this.$Message.success('insert data directory success');
                } catch (e) {
                    console.log(e);
                    this.$Message.error(e.response.data);
                }
            },
            async onDrop(params) {
                console.log(params);
                // save
                try {
                    const insert_result = await designer_data_directory.update_designer_data_directory({
                        "id": params["node"]["id"],
                        "pid": params["target"]["id"],
                    });
                    this.$Message.success('update data directory name success');
                } catch (e) {
                    console.log(e);
                    this.$Message.error(e.response.data);
                }
            },
            onClick(params) {
                console.log(params)
            },

            // getNewTree() {
            //     var vm = this
            //
            //     function _dfs(oldNode) {
            //         var newNode = {}
            //
            //         for (var k in oldNode) {
            //             if (k !== 'children' && k !== 'parent') {
            //                 newNode[k] = oldNode[k]
            //             }
            //         }
            //
            //         if (oldNode.children && oldNode.children.length > 0) {
            //             newNode.children = []
            //             for (var i = 0, len = oldNode.children.length; i < len; i++) {
            //                 newNode.children.push(_dfs(oldNode.children[i]))
            //             }
            //         }
            //         return newNode
            //     }
            //
            //     vm.newTree = _dfs(vm.data)
            // },
            async init_tree() {
                this._data.tree = new Tree(await designer_data_directory.query_designer_data_directory());
            },
        },
        async created() {
            await this.init_tree();
        },

    }

</script>


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
<style>
  .vtl-node-main .vtl-operation {
    margin-left: 2rem;
    letter-spacing: 10px;
  }

  @import '~view-design/dist/styles/iview.css';
</style>
