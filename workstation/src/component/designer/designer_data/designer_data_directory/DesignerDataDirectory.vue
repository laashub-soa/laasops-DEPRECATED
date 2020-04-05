<template>
  <div id="DesignerDataDirectory">

  </div>
</template>

<script>
    // import layui from 'layui-src/dist/layui'
    import request from "../../../../request.js";

    export default {
        name: "DesignerDataDirectory",
        data() {
            return {
                component: null,
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
        },
        async created() {
            await this.init_designer_data_directory();
        }
    }

</script>

<style scoped>
  @import "~layui-src/dist/css/layui.css";
  @import '~view-design/dist/styles/iview.css';
</style>
