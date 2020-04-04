<template>
  <div id="Designer">
    <DesignerDataDirectory></DesignerDataDirectory>
  </div>
</template>

<script>
    import DesignerDataDirectory from './designer_data/designer_data_directory/DesignerDataDirectory.vue'

    export default {
        name: "Designer",
        components: {
            DesignerDataDirectory
        },
    }
</script>

<style scoped>

</style>
