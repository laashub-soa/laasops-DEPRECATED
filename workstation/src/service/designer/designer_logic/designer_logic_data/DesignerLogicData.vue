<template>
  <div>
    language: Python; Version: 3+;
    <i-button type="primary" @click="standard.display = true">Show Standard</i-button>
    <modal v-model="standard.display" title="Logic Coding Standard">
      <pre v-html='standard.content'></pre>
    </modal>
    <textarea id="code" name="code"></textarea>
  </div>
</template>

<script>
    export default {
        name: "DesignerLogicData",
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
                editor: null,
                cur_writing: {
                    id: "",
                },
                standard: {
                    display: false,
                    content: '',
                },
            }
        },
        methods: {
            async init_editor(){

            },
        },
        created() {

        }
    }
</script>

<style scoped>

</style>
