<template>
  <div>
    <i-input v-model="directory.description"
             :readonly="directory.description_disabled"
             type="textarea">
    </i-input>
    <Button @click="init_table">Refresh</Button>
    <i-button @click="update_directory_description">
      {{directory.description_btn_name}}
    </i-button>
    <i-button @click="init_insert_">add line
    </i-button>
    <span style="user-select: text">table_prefix_name: designer_data_data_</span>
    <i-table stripe border :columns="columns"
             :data="data"
             :loading="loading"
    ></i-table>
    <collapse>
      <panel>
        Data Input Channel(Data input from Logic)
        <p slot="content"
           v-for="item in associate.io.set">{{item}}</p>
      </panel>
    </collapse>
    <collapse>
      <panel>
        Data Output Channel(Data output to Logic)
        <p slot="content"
           v-for="item in associate.io.get">{{item}}</p>
      </panel>
    </collapse>
    <!--                                        <collapse>-->
    <!--                                            <panel>-->
    <!--                                                // Data Subscribe Channel(Logic makes the data subscribe to its own changes(running/pause/exception/finish),after the logic changes,it will trigger time to the data,and the data will change)-->
    <!--                                                <p slot="content"-->
    <!--                                                   v-for="item in designer_data_directory.channel.data_subscribe">{{item}}</p>-->
    <!--                                            </panel>-->
    <!--                                        </collapse>-->
    <collapse>
      <panel>
        Data Trigger Channel(Logic subscribe to the data change(crud),after the data chanages, the event will be
        triggered to the logic, and the logic will be executed)
        <div slot="content">
          <!--insert-->
          <collapse>
            <panel>
              insert<p slot="content" v-for="item in associate.trigger.insert">{{item}}</p>
            </panel>
          </collapse>
          <!--update-->
          <collapse>
            <panel>
              update<p slot="content" v-for="item in associate.trigger.update">{{item}}</p>
            </panel>
          </collapse>
          <!--delete-->
          <collapse>
            <panel>
              delete<p slot="content" v-for="item in associate.trigger.delete">{{item}}</p>
            </panel>
          </collapse>

        </div>
      </panel>
    </collapse>

  </div>
</template>

<script>
    import designer_data_struct from "./designer_data_struct";
    import directory from "../../../../component/directory/directory";
    import component_table from "../../../../component/table";

    const update_description_btn_str = "update description";
    const save_description_btn_str = "save description";


    let column_width = component_table.calculate_table_column_width(true, this, 3);


    export default {
        name: "DesignerDataStruct",
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
                columns: [
                    component_table.editable_table_common_column(this, "code", "code", column_width),
                    component_table.editable_table_common_column(this, "meaning", "meaning", column_width),
                    component_table.editable_table_common_column(this, "reference_type", "reference_type", column_width),
                    component_table.editable_table_common_operation_column(this),
                ],
                data: [],
                data_line_backup: {},
                loading: false,
                is_in_opt: false,
                opt_name: "",
                opt_line: -1,
                associate: {
                    io: {
                        "set": [],
                        "get": [],
                    },
                    trigger: {
                        "insert": [],
                        "update": [],
                        "delete": [],
                    },
                },
                data_event_2_logic: {
                    cur_choose: {
                        value: [],
                        logic_id: "",
                        func_name: "",
                    },
                    data: [],
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
            async init_table() {
                await component_table.cancel_opt_data(this);
                this._data.loading = true;
                try {
                    this._data.data = await designer_data_struct.select_({'did': this.directory_id});
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
                    await designer_data_struct.insert_(data_struct);
                    component.$Message.success('insert data struct success');
                    await component.init_table();
                } catch (e) {
                    console.log(e.response.data);
                    component.$Message.error(e.response.data);
                }
            },
            async update_(component, data_struct) {
                try {
                    await designer_data_struct.update_(data_struct);
                    component.$Message.success('update data struct success');
                    await component.init_table();
                } catch (e) {
                    console.log(e.response.data);
                    component.$Message.error(e.response.data);
                }
            },
            async delete_(component, data_struct) {
                try {
                    await designer_data_struct.delete_(data_struct);
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
            await this.init_table();
        }
    }
</script>

<style scoped>

</style>
