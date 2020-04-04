<template>
  <div id="app">
    <router-link to='/Designer'>Dashboard</router-link>
    <br/>
    <router-link to='/Dashboard'>Designer</router-link>
  </div>
</template>

<script>
    export default {
        name: 'workstation',
        data() {
            return {}
        },
        components: {
        },
        methods: {},
        watch: {}
    }
    // setTimeout(function () {
    //     window.location.href = "component/Dashboard/index.html";
    // }, 2000);
</script>

<style>

</style>
