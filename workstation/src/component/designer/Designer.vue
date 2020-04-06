<template>
  <div style="height: 100vh">
    <div style="height: 30px;">
      <span>
        <Breadcrumb>
            <BreadcrumbItem v-for="item in breadcrumb.list">
                {{item}}
            </BreadcrumbItem>
        </Breadcrumb>
      </span>
      <span style="color: green;margin-left: 30px;font-size: 22px;">
                id: {{breadcrumb.cur_selected_id}}
      </span>
    </div>
    <div style="height: 96vh;border: 1px solid #d6d6d6;">
      <span style="height: 100%;width: 40px;float: left;border: 1px solid #dcdee2">
          <i-menu theme="dark" width="auto" :active-name="menu_active_name" @on-select="function(name){menu_active_name = name}">
              <!--writing-mode: vertical-lr;-->
              <menu-item name="data" width="auto" style="user-select:none;">
                  Data
              </menu-item>
              <menu-item name="logic" width="auto" style="user-select:none;">
                  Logic
              </menu-item>
          </i-menu>
      </span>
      <span style="width: 94vw;height:97vh;">
            <Split v-model="split" >
                <div slot="left" style="margin-left: 40px">
                    <DesignerDataDirectory v-show="menu_active_name=='data'"></DesignerDataDirectory>
                    <!--v-show="menu_active_name=='logic'"-->
                </div>
                <div slot="right">
                  <!--
                    <tabs v-model="tab_pane_cur" type="card" closable @on-tab-remove="handleTabRemove" :animated="false"
                          style="user-select:none;">
                        &lt;!&ndash;style="margin-left: 10px"&ndash;&gt;
                        <tab-pane :label="item.label" v-if="tab_pane[index].visible" v-for="(item,index) in tab_pane"
                                  :icon="item.icon"
                                  style="margin-left: 2px;">
                            &lt;!&ndash;data&ndash;&gt;
                            <div v-show="item.type=='data'">
                                        <i-input v-model="designer_data_directory.cur_selected.description"
                                                 :readonly="designer_data_directory.cur_selected.description_disabled"
                                                 type="textarea">
                                        </i-input>
                                        <i-button type="primary"
                                                  @click="execute('designer_data_directory.do_update_designer_data_directory__description')">{{vue_data.designer_data_directory.cur_selected.description_btn_name}}</i-button>
                                        <i-button type="primary"
                                                  @click="execute('data_struct.do_insert_designer_data_struct')">add one line</i-button>
                                        <span style="user-select: text">table_prefix_name: designer_data_data_</span>
                                        <i-table stripe border :columns="data_struct.columns"
                                                 :data="data_struct.data"
                                                 :loading="data_struct.loading"
                                        ></i-table>
                                        <collapse>
                                            <panel>
                                                Data Input Channel(Data input from Logic)
                                                <p slot="content"
                                                   v-for="item in data_struct.associate.io.set">{{item}}</p>
                                            </panel>
                                        </collapse>
                                        <collapse>
                                            <panel>
                                                Data Output Channel(Data output to Logic)
                                                <p slot="content"
                                                   v-for="item in data_struct.associate.io.get">{{item}}</p>
                                            </panel>
                                        </collapse>
                              &lt;!&ndash;                                        <collapse>&ndash;&gt;
                              &lt;!&ndash;                                            <panel>&ndash;&gt;
                              &lt;!&ndash;                                                // Data Subscribe Channel(Logic makes the data subscribe to its own changes(running/pause/exception/finish),after the logic changes,it will trigger time to the data,and the data will change)&ndash;&gt;
                              &lt;!&ndash;                                                <p slot="content"&ndash;&gt;
                              &lt;!&ndash;                                                   v-for="item in designer_data_directory.channel.data_subscribe">{{item}}</p>&ndash;&gt;
                              &lt;!&ndash;                                            </panel>&ndash;&gt;
                              &lt;!&ndash;                                        </collapse>&ndash;&gt;
                                        <collapse>
                                            <panel>
                                               Data Trigger Channel(Logic subscribe to the data change(crud),after the data chanages, the event will be triggered to the logic, and the logic will be executed)
                                                <div slot="content">
                                                    &lt;!&ndash;insert&ndash;&gt;
                                                    <collapse>
                                                        <panel>
                                                           insert<p slot="content" v-for="item in data_struct.associate.trigger.insert">{{item}}</p>
                                                        </panel>
                                                    </collapse>
                                                  &lt;!&ndash;update&ndash;&gt;
                                                    <collapse>
                                                        <panel>
                                                           update<p slot="content" v-for="item in data_struct.associate.trigger.update">{{item}}</p>
                                                        </panel>
                                                    </collapse>
                                                  &lt;!&ndash;delete&ndash;&gt;
                                                    <collapse>
                                                        <panel>
                                                           delete<p slot="content" v-for="item in data_struct.associate.trigger.delete">{{item}}</p>
                                                        </panel>
                                                    </collapse>

                                                </div>
                                            </panel>
                                        </collapse>
                            </div>
                          &lt;!&ndash;logic&ndash;&gt;
                            <div v-show="item.type=='logic'">
                                language: Python; Version: 3+; <i-button type="primary" @click="designer_logic_data.standard.display = true">Show Standard</i-button>
                                    <modal v-model="designer_logic_data.standard.display" title="Logic Coding Standard" ><pre v-html='designer_logic_data.standard.content'></pre></modal>
                                <textarea id="code" name="code"></textarea>
                            </div>
                        </tab-pane>
                    </tabs>
                --></div>
            </Split>
        </span>
    </div>


    <!--    <DesignerDataDirectory></DesignerDataDirectory>-->
  </div>
</template>

<script>
    import DesignerDataDirectory from './designer_data/designer_data_directory/DesignerDataDirectory.vue'

    export default {
        name: "Designer",
        components: {
            DesignerDataDirectory
        },
        data() {
            return {
                //
                breadcrumb: {
                    list: [],
                    cur_selected_id: '',
                },
                //
                menu_active_name: "data",
                menu_init_record: {},
                //
                split: 0.2,
                //
                tab_pane: [],
                tab_pane_cur: "",
            }
        },
        methods: {
            handleTabRemove(name) {
                this._data.tab_pane[name]["visible"] = false;
            },
        },
    }
</script>

<style>
  @import '~view-design/dist/styles/iview.css';

  .ivu-split-trigger-vertical {
    width: 2px;
    background: #d6d6d6;
  }

  .ivu-split-trigger {
    border: 0px;
  }

  .ivu-tabs-bar {
    margin-bottom: 1px;
  }

  .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
    padding: 0 0px;
  }

  .ivu-breadcrumb {
    font-size: 22px;
    float: left;
  }
</style>
