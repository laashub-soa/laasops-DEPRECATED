<template>
  <div>
    <DirectoryDescription :directory_id="directory_id"></DirectoryDescription>
    <!--    <Button @click="init_table">Refresh</Button>-->

    <i-button @click="init_table">SEARCH</i-button>
    <i-button @click="init_insert_">ADD</i-button>

    <!--search area-->
    <divider orientation="left" style="font-size: 12px;">
      <i-button
        @click="function(){search.expand_status=!search.expand_status;}">
        EXPAND/COLLAPSE SEARCH CONDITION AREA
      </i-button>
    </divider>
    <div v-if="search.expand_status" style="margin-left: 10px">
      <!--dynamic search form-->
      <i-form :model="search.data"
              :label-width="80">
        <row>
          <i-col span="6" v-for="item in search.template">
            <form-item :label="item.label" :prop="item.prop">
              <i-input v-model="item.v_model"></i-input>
            </form-item>
          </i-col>
        </row>
      </i-form>
    </div>
    <!--operator-->
    <!--                                        <div style="margin-left: 10px;margin-bottom: 10px">-->
    <!--                                            <i-button >test</i-button>-->
    <!--                                        </div>-->
    <i-table stripe border :columns="columns"
             :data="data"
             :loading="loading"
             height="500"
             border
    ></i-table>
    <!--data status show detail modal-->
    <modal v-model="data_status_details.display" width="100vw">
      <p slot="header">
        <span>details</span>
      </p>
      <div>
        <row>
          <i-col span="6">
            <div id="engine_data_logic_trigger_data_status_details_status_tree"
            ></div>
            <!--@on-select-change="load_target_time_log"-->
          </i-col>
          <i-col span="18" style="background: #2b2b2b;color: white">
                                                        <pre v-for="item in data_status_details.log_list">
                                                            {{item}}
                                                        </pre>
          </i-col>
        </row>
      </div>
      <div slot="footer"></div>
    </modal>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <page show-sizer :total="page.total" :current="1"
              @on-change="function(current){page.current = current;init_table();}"
              @on-page-size-change="function(page_size){page.page_size = page_size;init_table();}"
        />
      </div>
    </div>

  </div>
</template>

<script>
    import DirectoryDescription from "../../../../component/directory/DirectoryDescription";
    import designer_data_struct from "../designer_data_struct/designer_data_struct";
    import designer_data_data from "./designer_data_data";
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
        components: {
            DirectoryDescription
        },
        data() {
            return {
                column_keys: [],
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
            async init_table_column() {
                await component_table.cancel_opt_data(this);
                this._data.loading = true;
                try {
                    const data_struct_list = await designer_data_struct.select_({'did': this.directory_id});
                    if (data_struct_list < 1) {
                        this._data.loading = false;
                        return;
                    }
                    const column_width = component_table.calculate_table_column_width(false, this, data_struct_list.length);
                    // basic column
                    for (const item of data_struct_list) {
                        const code = item["code"];
                        const meaning = item["meaning"];
                        this._data.column_keys.push(code);
                        this._data.columns.push(component_table.editable_table_common_column(this, meaning, code, column_width));
                        this._data.search.template.push({"label": meaning, "prop": code, "v_model": ""});
                    }
                    // operation column
                    this._data.columns.push(component_table.editable_table_common_operation_column(this));
                    // status column
                    this._data.columns.push(component_table.table_column_operation_status(this));

                    this.$Message.success('query data data columns success');
                } catch (e) {
                    console.log(e);
                    this.$Message.error(e.response.data);
                }
                this._data.loading = false;
            },
            async init_table() {
                await component_table.cancel_opt_data(this);
                this._data.loading = true;
                try {
                    /*                    const request_standard = {
                                            page_current: -1,
                                            page_size: 10,
                                            search: {},
                                            order: [],
                                        }
                                        const resp_standard = {
                                            page_total: 10,
                                            data: [],

                                            page_current: -1,
                                            page_size: 10,
                                            search: {},
                                            order: [],
                                        }*/
                    // page & search (order,search with express)
                    const request_data = {
                        page_current: this._data.page.current,
                        page_size: this._data.page.page_size,
                        search: {'did': this.directory_id},
                    };
                    // gen search
                    const search_list = this._data.search.template;
                    for (const item of search_list) {
                        const prop = item["prop"];
                        const v_model = item["v_model"];
                        if (!v_model || v_model == '') continue;
                        request_data.search[prop] = v_model;
                    }
                    const resp_data = await designer_data_data.select_(request_data);
                    this._data.page.total = resp_data['page_total'];
                    this._data.data = resp_data['data'];

                    this.$Message.success('query data_struct success');
                } catch (e) {
                    console.log(e);
                    this.$Message.error(e.response.data);
                }
                this._data.loading = false;
            },
            init_insert_() {
                component_table.init_insert_(this);
            },
            async insert_(component, data_data) {
                try {
                    await designer_data_data.insert_(data_data);
                    component.$Message.success('insert data data success');
                    await component.init_table();
                } catch (e) {
                    console.log(e.response.data);
                    component.$Message.error(e.response.data);
                }
            },
            async update_(component, data_data) {
                try {
                    await designer_data_data.update_(data_data);
                    component.$Message.success('update data data success');
                    await component.init_table();
                } catch (e) {
                    console.log(e.response.data);
                    component.$Message.error(e.response.data);
                }
            },
            async delete_(component, data_data) {
                try {
                    await designer_data_data.delete_(data_data);
                    component.$Message.success('delete data data success');
                    await component.init_table();
                } catch (e) {
                    console.log(e.response.data);
                    component.$Message.error(e.response.data);
                }
            },
        },
        async created() {
            await this.init_table_column();
            await this.init_table();
        }
    }
</script>

<style scoped>

</style>
