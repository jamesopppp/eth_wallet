<template>
  <div class="header-bar">
      <i @click="goBack" class="iconfont icon-xiangzuojiantou backArrow"></i>
      <span class="bar-title">{{title}}</span>
      <img v-show="scan" @click="goScan" class="scan" src="./scan.png">
      <i @click="goAddContact" v-show="add" class="iconfont icon-zengjia-01 add"></i>
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
      this.$router.replace({ name: "scan" });
    },
    goAddContact() {
      this.$router.push({ path: "addContact", query: { isAdd: 1 } });
    }
  },
  props: {
    title: String,
    scan: Boolean,
    add: Boolean
  }
};
</script>

<style lang="less" scoped>
@import "./header-bar.less";
</style>