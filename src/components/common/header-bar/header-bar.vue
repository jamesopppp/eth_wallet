<template>
  <div class="header-bar">
      <i @click="goBack" class="iconfont icon-xiangzuojiantou backArrow"></i>
      <span class="bar-title">{{title}}</span>
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
    }
  },
  props: {
    title: String
  }
};
</script>

<style lang="less" scoped>
@import "./header-bar.less";
</style>