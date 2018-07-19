<template>
  <div class="header-bar">
      <i @click="goBack" class="iconfont icon-xiangzuojiantou backArrow"></i>
      <span class="bar-title">{{title}}</span>
      <img v-show="scan" @click="goScan" class="scan" src="./scan.png">
  </div>
</template>

<script>
export default {
  name: "header-bar",
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goScan() {
      this.$router.push({ name: "scan" });
    }
  },
  props: {
    title: String,
    scan: Boolean
  }
};
</script>

<style lang="less" scoped>
@import "./header-bar.less";
</style>