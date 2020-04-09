<template>
  <div>
    language: Python; Version: 3+;
    <i-button type="primary" @click="standard.display = true">Show Standard</i-button>
    <modal v-model="standard.display" title="Logic Coding Standard" width="80vw">
      <pre style="width: 90vw">{{standard.content}}</pre>
    </modal>
    <codemirror
      ref="cmEditor"
      :value="code"
      :options="cmOptions"
      @ready="onCmReady"
      @focus="onCmFocus"
      @input="onCmCodeChange"
    />
  </div>
</template>
<script>
    import {codemirror} from 'vue-codemirror'
    import 'codemirror/addon/selection/active-line.js'
    import 'codemirror/addon/edit/matchbrackets.js'
    import 'codemirror/addon/display/fullscreen.js'
    import 'codemirror/mode/python/python.js'
    import designer_logic_data from "./designer_logic_data";

    export default {
        name: "DesignerLogicData",
        components: {
            codemirror
        },
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
            const component = this;
            return {
                standard: {
                    display: false,
                    content: '',
                },
                code: '',
                cmOptions: {
                    tabSize: 4,
                    line: true,
                    lineNumbers: true,
                    indentUnit: 4,
                    styleActiveLine: true,
                    matchBrackets: true,
                    mode: {
                        name: "python",
                        version: 3,
                        singleLineStringErrors: false
                    },
                    lineWrapping: true,
                    theme: 'monokai',
                    extraKeys: {
                        Tab: function (cm) {
                            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                            cm.replaceSelection(spaces);
                        },
                        "F11": function (cm) {
                            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                        },
                        "Esc": function (cm) {
                            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                        },
                        'Ctrl-S': function () {
                            // update_designer_logic_data();
                            component.update_(component);
                        }
                    },
                },
                id: '',
            }
        },
        methods: {
            onCmReady(cm) {
                // console.log('the editor is readied!', cm)
            },
            onCmFocus(cm) {
                // console.log('the editor is focused!', cm)
            },
            onCmCodeChange(newCode) {
                // console.log('this is new code', newCode)
                this.code = newCode
            },
            async init_editor() {
                try {
                    const select_result = await designer_logic_data.select_({'did': this.directory_id});
                    this._data.code = select_result[0]['file'];
                    this._data.id = select_result[0]['id'];
                    this.$Message.success('query logic data success');
                } catch (e) {
                    console.log(e);
                    this.$Message.error(e.response.data);
                }
            },
            update_(component) {
                console.log(component._data.code);
                const designer_logic_data = {};
                // designer_logic_data.update_(designer_logic_data);
            },
        },
        computed: {
            codemirror() {
                return this.$refs.cmEditor.codemirror
            }
        },
        mounted() {
            // console.log('the current CodeMirror instance object:', this.codemirror)
            // you can use this.codemirror to do something...
        },
        async created() {
            this._data.standard.content = designer_logic_data.get_standard_content();
            await this.init_editor();
        },
    }
</script>

<style>
  @import '~codemirror/lib/codemirror.css';
  @import '~codemirror/theme/monokai.css';
  @import '~codemirror/addon/display/fullscreen.css';

  .CodeMirror {
    /*height: 100vh;*/
  }
</style>
