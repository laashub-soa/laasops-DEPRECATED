<template>
  <div>
    <Button @click="onAddNode(null)">Add Node</Button>
    <vue-tree-list
      @click="onClick"
      @change-name="onChangeName"
      @delete-node="onDel"
      @add-node="onAddNode"
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
                newTree: {},
            }
        },
        methods: {
            onDel(node) {
                console.log(node)
                node.remove()
            },

            onChangeName(params) {
                console.log(params)
            },

            onAddNode(params) {
                if (!params){
                    var node = new TreeNode({name: 'new node', isLeaf: false,addLeafNodeDisabled: true,})
                    if (!this.data.children) this.data.children = []
                    this.data.addChildren(node)
                }
                console.log(params)
            },

            onClick(params) {
                console.log(params)
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
            this._data.tree = new Tree(await designer_data_directory.query_designer_data_directory());
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
