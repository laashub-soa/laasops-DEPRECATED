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

    const update_description_btn_str = "update description";
    const save_description_btn_str = "save description";

    function cancel_opt_data(component) {
        const opt_name = component._data.opt_name;
        if ("insert" == opt_name) {
            component._data.data.pop();
        } else if ("update" == opt_name) {
            // 还原
            component._data.is_in_opt = false;
            component._data.opt_name = "";
            const cur_line = component._data.opt_line;
            component._data.opt_line = -1;
            component._data.data[cur_line] = component._data.data_line_backup;
        }
        component._data.is_in_opt = false;
        component._data.opt_name = "";
        component._data.opt_line = -1;
    }


    function calculate_table_column_width(component, column_number) {
        const window_width = document.documentElement.clientWidth;
        const right_window_width = window_width * (1 - component.split_value);
        let nav_area_width = 10;
        let table_column_operation_status_width_temp;
        table_column_operation_status_width_temp = table_column_operation_status_width;
        return (right_window_width - editable_table_common_operation_column_width - table_column_operation_status_width_temp - nav_area_width) / column_number;
    }

    const editable_table_common_operation_column_width = 90;
    const table_column_operation_status_width = 130;

    let editable_table_common_column_width = calculate_table_column_width(this, 3);

    function editable_table_common_column(component, title, key) {
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
                if (component._data.is_in_opt && component._data.opt_line == params.index) {
                    let edit_value = "";
                    if ("insert" == component._data.opt_name) {
                    } else if ("update" == component._data.opt_name) {
                        edit_value = component._data.data[params.index][params.column.key];
                    }
                    return h('Input', {
                        props: {
                            type: 'text',
                            value: edit_value
                        },
                        on: {
                            'on-change'(event) {
                                component._data.data[params.index][params.column.key] = event.target.value;
                            }
                        }
                    })
                }
                return h('div', {
                    domProps: {
                        innerHTML: component._data.data[params.index][params.column.key],
                    },
                })
            }
        }
    }


    function editable_table_common_operation_column(component) {
        return {
            title: 'operation',
            slot: 'operation',
            align: 'center',
            width: editable_table_common_operation_column_width,
            resizable: true,
            render: (h, params) => {
                const div_data = [];
                if (component._data.is_in_opt && component._data.opt_line == params.index) {
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
                                const cur_line_data = component._data.data[cur_line_index];
                                cancel_opt_data(component, cur_line_data);
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
                                const cur_line_data = component._data.data[cur_line_index];
                                cur_line_data['did'] = component.directory_id;

                                console.log("cur_line_data");
                                console.log(cur_line_data);
                                if ("insert" == component._data.opt_name) {
                                    component.insert_(component, cur_line_data);
                                } else if ("update" == component._data.opt_name) {
                                    component.update_(component, cur_line_data);
                                }
                            }
                        }
                    }, 'save'));
                }
                let is_display_edit = true;
                if (component._data.is_in_opt && component._data.opt_line == params.index && ("update" == component._data.opt_name || "insert" == component._data.opt_name)) {
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
                                component._data.is_in_opt = true;
                                component._data.opt_name = "update";
                                component._data.opt_line = cur_line_index;
                                const cur_line_data = component._data.data[cur_line_index];
                                component._data.data[cur_line_index] = cur_line_data;
                                cur_line_data['did'] = component.directory_id;
                                component._data.data_line_backup = JSON.parse(JSON.stringify(cur_line_data));
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
                                        component._data.is_in_opt = true;
                                        component._data.opt_name = "delete";
                                        component._data.opt_line = cur_line_index;
                                        const cur_line_data = component._data.data[cur_line_index];
                                        cur_line_data['did'] = component.directory_id;

                                        component.delete_(component, cur_line_data);
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
