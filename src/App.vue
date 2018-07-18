<template>
<v-app>
  <div id="app">
      <router-view />
      <v-bottom-nav v-show="tab===0||tab===1||tab===2"/>
  </div>
  </v-app>
</template>

<script>
import { getStore, setStore, objIsNull, createWallet } from "@/config/utils";
import { mapState } from "vuex";
import vBottomNav from "./components/common/bottom-nav/bottom-nav";
export default {
  name: "App",
  data() {
    return {
      bottomNav: "recent"
    };
  },
  watch: {
    $route(to, from) {
      if (to.name != "home" && to.name != "transaction" && to.name != "my") {
        this.$store.commit("SET_TAB", 3);
      }
    }
  },
  created() {},
  methods: {},
  computed: {
    ...mapState(["tab"])
  },
  components: {
    vBottomNav
  }
};
</script>

<style lang="less">
html,
body {
  height: 100vh;
  overflow: hidden;
  background: transparent !important;
}
#app {
  color: #353535;
  font-family: normal, "Microsoft YaHei", Arial, Helvetica, sans-serif, "宋体";
}
</style>
