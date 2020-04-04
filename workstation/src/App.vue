<template>
  <div id="app">
      <a href="component/Dashboard/index.html">Dashboard</a>
      <br/>
      <a href="component/Designer/index.html">Designer</a>
  </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {}
        },
        components: {},
        methods: {},
        watch: {}
    }
    setTimeout(function () {
        window.location.href = "component/Dashboard/index.html";
    }, 2000);
</script>

<style>

</style>
