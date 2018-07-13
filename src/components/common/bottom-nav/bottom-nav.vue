<template>
  <div class="bottom-nav">
      <div v-ripple @click="navTo(0)">
          <div>
              <img src="@/assets/images/zichan-zhengc.png">
              <div class="point animated jackInTheBox" v-show="tab===0"></div>
          </div>
          <p>资产</p>
      </div>
      <div v-ripple @click="navTo(1)">
          <div>
              <img src="@/assets/images/zhuanr-zhengc.png">
              <div class="point animated jackInTheBox" v-show="tab===1"></div>
          </div>
          <p>转入</p>
      </div>
      <div v-ripple @click="navTo(2)">
          <div>
              <img src="@/assets/images/my-zhengc.png">
              <div class="point animated jackInTheBox" v-show="tab===2"></div>
          </div>
          <p>我</p>
      </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "bottom-nav",
  data() {
    return {};
  },
  computed: {
    ...mapState(["tab"])
  },
  methods: {
    navTo(index) {
      if (index === 0) {
        if (this.tab !== 0) {
          this.$store.commit("SET_TAB", index);
          this.$router.push({ name: "home" });
        }
      } else if (index === 1) {
        if (this.tab !== 1) {
          this.$store.commit("SET_TAB", index);
          this.$router.push({ name: "transaction" });
        }
      } else if (index === 2) {
        if (this.tab !== 2) {
          this.$store.commit("SET_TAB", index);
          this.$router.push({ name: "my" });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./bottom-nav.less";
</style>