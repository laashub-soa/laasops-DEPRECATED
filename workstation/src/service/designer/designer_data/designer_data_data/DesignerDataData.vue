<template>
  <div>
    <i-input v-model="directory.description"
             :readonly="directory.description_disabled"
             type="textarea">
    </i-input>
    <Button @click="init_table">Refresh</Button>

  </div>
</template>

<script>
    import designer_data_data from "./designer_data_data";
    import designer_data_struct from "../designer_data_struct/designer_data_struct";
    import directory from "../../../../component/directory/directory";
    import component_table from "../../../../component/table";
    const update_description_btn_str = "update description";
    const save_description_btn_str = "save description";


    export default {
        name: "DesignerDataData",
        props: {
            directory_id: {
                default: 60,
                type: Number,
            },
            directory_name: {
                default: 'test',
                type: String,
            },
            split_value: {
                default: 0.2,
            },
        },
        data() {
            return {
                directory: {
                    description: "",
                    description_disabled: true,
                    description_btn_name: update_description_btn_str,
                },
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
            }
        },
        methods: {
            async init_description() {
                const data_directory = {
                    'id': this.directory_id,
                }
                try {
                    const data_directory_result = await directory.select_("data", data_directory);
                    this._data.directory.description = data_directory_result[0].description;
                    this.$Message.success('select data directory description success');
                } catch (e) {
                    console.log(e);
                    this.$Message.error(e.response.data);
                }

            },
            async update_directory_description() {
                if (this._data.directory.description_disabled) {
                    this._data.directory.description_disabled = false;
                    this._data.directory.description_btn_name = save_description_btn_str;
                    return;
                }
                this._data.directory.description_disabled = true;
                this._data.directory.description_btn_name = update_description_btn_str;
                const data_directory = {
                    'id': this.directory_id,
                    'description': this._data.directory.description,
                }
                try {
                    await directory.update_("data", data_directory);
                    this.$Message.success('update data directory description success');
                } catch (e) {
                    console.log(e);
                    this.$Message.error(e.response.data);
                }

            },
            async init_table_column(){

            },
            async init_table() {
                await cancel_opt_data(this);
                this._data.loading = true;
                try {
                    // this._data.data = await designer_data_struct.select_({'did': this.directory_id});
                    this.$Message.success('query data_struct success');
                } catch (e) {
                    console.log(e);
                    this.$Message.error(e.response.data);
                }
                this._data.loading = false;
            },
            init_insert_() {
                // can not continuous multiple times add/update
                if (this._data.is_in_opt) {
                    this.$Message.error("can not continuous multiple times add/update");
                    return;
                }
                this._data.is_in_opt = true;
                this._data.opt_name = "insert";

                // construct column
                const temp_data_one = {};
                for (const item of this._data.columns) {
                    const key = item["key"];
                    if (key && key != "") {
                        temp_data_one[key] = "";
                    }
                }
                this._data.opt_line = this._data.data.length;
                this._data.data.push(temp_data_one);
            },
            async insert_(component, data_struct) {
                try {
                    // await designer_data_struct.insert_(data_struct);
                    component.$Message.success('insert data struct success');
                    await component.init_table();
                } catch (e) {
                    console.log(e.response.data);
                    component.$Message.error(e.response.data);
                }
            },
            async update_(component, data_struct) {
                try {
                    // await designer_data_struct.update_(data_struct);
                    component.$Message.success('update data struct success');
                    await component.init_table();
                } catch (e) {
                    console.log(e.response.data);
                    component.$Message.error(e.response.data);
                }
            },
            async delete_(component, data_struct) {
                try {
                    // await designer_data_struct.delete_(data_struct);
                    component.$Message.success('delete data struct success');
                    await component.init_table();
                } catch (e) {
                    console.log(e.response.data);
                    component.$Message.error(e.response.data);
                }
            },
        },
        async created() {
            await this.init_description();
            await this.init_table_column();
            await this.init_table();
        }
    }
</script>

<style scoped>

</style>
