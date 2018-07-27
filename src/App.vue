<template>
<v-app>
  <div id="app">
      <router-view />
      <v-bottom-nav v-show="tab===0||tab===1||tab===2"/>
  </div>
  <v-snackbar class="backButton" v-model="backButton" color="info" :timeout="1200">
      再点击一次退出App
      <v-btn dark flat @click="backButton = false">
        关闭
      </v-btn>
  </v-snackbar>
  </v-app>
</template>

<script>
import { getStore, setStore, objIsNull, createWallet } from "@/config/utils";
import { mapState } from "vuex";
import vBottomNav from "./components/common/bottom-nav/bottom-nav";
import { EALREADY } from "constants";
export default {
  name: "App",
  data() {
    return {
      backButton: false,
      beginDate: 0,
      endDate: 0,
      isToast: false
    };
  },
  watch: {
    $route(to, from) {
      if (to.name != "home" && to.name != "transaction" && to.name != "my") {
        this.$store.commit("SET_TAB", 3);
      }
      if (
        to.name == "home" ||
        to.name == "transaction" ||
        to.name == "my" ||
        to.name == "open-home"
      ) {
        document.addEventListener("backbutton", this.onBackKeyDown, false);
      } else {
        document.removeEventListener("backbutton", this.onBackKeyDown, false);
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    onBackKeyDown() {
      this.endDate = new Date().getTime();
      if (this.isToast && this.endDate - this.beginDate < 2000) {
        this.beginDate = this.endDate;
        this.isToast = false;
        navigator.app.exitApp();
      } else {
        this.backButton = true;
        this.beginDate = new Date().getTime();
        this.isToast = true;
      }
    },
  },
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
.backButton {
  font-size: 24px;
  height: 90px;
  border-radius: 5px;
  line-height: 90px;
  width: 60%;
  margin: 0 auto 5px auto;
  overflow: hidden;
  .v-btn__content{
    font-size: 24px;
  }
}
</style>
