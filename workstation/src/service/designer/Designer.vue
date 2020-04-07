<template>
  <div style="height: 100vh">
    <div>
      <Menu style="font-size: 10px" mode="horizontal" theme="light" :active-name="menu_active_name"
            @on-select="function(name){menu_active_name = name}">
        <MenuItem :name="item" width="40px" style="user-select:none;text-transform:uppercase;"
                  v-for="item in service_type_list">
          {{item}}
        </MenuItem>
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
    <div style="height: 93vh;border: 1px solid #d6d6d6;">
        <span style="height:93vh;">
            <Split v-model="split">
                <div slot="left">
                  <Directory @click-directory="OnClickDirectory" v-show="menu_active_name==item" :service_type="item"
                             v-for="item in service_type_list"></Directory>
                </div>
                <div slot="right">
                    <Tabs v-model="tab_pane_cur" type="card" closable @on-tab-remove="handleTabRemove" :animated="false"
                          style="user-select:none;">
                        <TabPane :label="item.label" v-if="tab_pane[index].visible" v-for="(item,index) in tab_pane"
                                 :icon="item.icon">
<!--                            v-show="item.type=='data'"-->
                          <!--                          v-show="item.type=='logic'"-->

                        </TabPane>
                    </Tabs>
                </div>
            </Split>
        </span>
    </div>
  </div>
</template>

<script>
    import Directory from '../../component/directory/Directory.vue'

    export default {
        name: "Designer",
        components: {
            Directory
        },
        data() {
            return {
                // service type list
                service_type_list: ['data', 'logic'],
                // breadcrumb
                breadcrumb: {
                    list: [],
                    cur_selected_id: '',
                },
                //
                menu_active_name: "data",
                // split
                split: 0.2,
                // tab_pane
                tab_pane: [],
                tab_pane_cur: "",
            }
        },
        methods: {
            handleTabRemove(name) {
                this._data.tab_pane[name]["visible"] = false;
            },
            OnClickDirectory(service_type, directory) {
                const _id = directory["id"];
                const name = directory["name"];
                // set breadcrumb
                const breadcrumb_list = [name];
                this._data.breadcrumb.cur_selected_id = _id;
                let parent = directory["parent"];
                while (parent) {
                    breadcrumb_list.push(parent["name"]);
                    if (parent["parent"]) parent = parent["parent"];
                    else parent = null;
                }
                breadcrumb_list.pop();
                this._data.breadcrumb.list = breadcrumb_list.reverse();

                // update the right panel
                const cur_service_type = this._data.menu_active_name;
                let label = name;
                let is_not_exist = true;
                const tab_panel_id = cur_service_type + _id;
                for (const index in this._data.tab_pane) {
                    const item = this._data.tab_pane[index];
                    if (item['name'] == tab_panel_id) {
                        is_not_exist = false;
                        this._data.tab_pane_cur = parseInt(index);
                        break;
                    }
                    if (label == item['label']) {
                        label = breadcrumb_list.join(" / ");
                    }
                }
                if (is_not_exist) {
                    let icon = 'md-albums';
                    if (cur_service_type == 'logic') {
                        icon = 'md-cog';
                    }

                    this._data.tab_pane.push({
                        'type': cur_service_type,
                        'name': tab_panel_id,
                        'label': label,
                        'visible': true,
                        'icon': icon,
                    });
                    this._data.tab_pane_cur = this._data.tab_pane.length - 1;
                }
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
