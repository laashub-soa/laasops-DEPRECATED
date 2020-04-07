<template>
<div>
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
  <!--                                        <collapse>-->
  <!--                                            <panel>-->
  <!--                                                // Data Subscribe Channel(Logic makes the data subscribe to its own changes(running/pause/exception/finish),after the logic changes,it will trigger time to the data,and the data will change)-->
  <!--                                                <p slot="content"-->
  <!--                                                   v-for="item in designer_data_directory.channel.data_subscribe">{{item}}</p>-->
  <!--                                            </panel>-->
  <!--                                        </collapse>-->
  <collapse>
    <panel>
      Data Trigger Channel(Logic subscribe to the data change(crud),after the data chanages, the event will be triggered to the logic, and the logic will be executed)
      <div slot="content">
        <!--insert-->
        <collapse>
          <panel>
            insert<p slot="content" v-for="item in data_struct.associate.trigger.insert">{{item}}</p>
          </panel>
        </collapse>
        <!--update-->
        <collapse>
          <panel>
            update<p slot="content" v-for="item in data_struct.associate.trigger.update">{{item}}</p>
          </panel>
        </collapse>
        <!--delete-->
        <collapse>
          <panel>
            delete<p slot="content" v-for="item in data_struct.associate.trigger.delete">{{item}}</p>
          </panel>
        </collapse>

      </div>
    </panel>
  </collapse>

</div>
</template>

<script>
    export default {
        name: "DesignerDataStruct"
    }
</script>

<style scoped>

</style>
