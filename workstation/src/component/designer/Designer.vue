<template>
  <div style="height: 100vh">
    <div >
      <Menu style="font-size: 10px" mode="horizontal" theme="light" :active-name="menu_active_name"
              @on-select="function(name){menu_active_name = name}">
        <!--writing-mode: vertical-lr;-->
        <MenuItem name="data" width="40px" style="user-select:none;">
          Data
        </MenuItem>
        <MenuItem name="logic" width="40px" style="user-select:none;">
          Logic
        </MenuItem >
      </Menu>
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
        <span style="height:97vh;">
            <Split v-model="split" style="width: 94vw">
                <div slot="left">
                    <DesignerDataDirectory @click-directory="OnClickDirectory"
                                           v-show="menu_active_name=='data'"></DesignerDataDirectory>
                  <!--v-show="menu_active_name=='logic'"-->
                </div>
                <div slot="right">
                    <tabs v-model="tab_pane_cur" type="card" closable @on-tab-remove="handleTabRemove" :animated="false"
                          style="user-select:none;">
                        <!--style="margin-left: 10px"-->
                        <tab-pane :label="item.label" v-if="tab_pane[index].visible" v-for="(item,index) in tab_pane"
                                  :icon="item.icon"
                                  style="margin-left: 2px;">
<!--                            v-show="item.type=='data'"-->
                          <!--                          v-show="item.type=='logic'"-->

                        </tab-pane>
                    </tabs>
                </div>
            </Split>
        </span>
    </div>
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
            OnClickDirectory(directory) {
                console.log(directory);
                const _id = directory["id"];
                // set breadcrumb
                const breadcrumb_list = [directory["name"]];
                this._data.breadcrumb.cur_selected_id = _id;
                let parent = directory["parent"];
                while (parent) {
                    breadcrumb_list.push(parent["name"]);
                    if (parent["parent"]) parent = parent["parent"];
                    else parent = null;
                }
                this._data.breadcrumb.list = breadcrumb_list.reverse();
                // update the right panel

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
  .ivu-menu-horizontal {
    height: 30px;
    line-height: 30px;
  }
</style>
