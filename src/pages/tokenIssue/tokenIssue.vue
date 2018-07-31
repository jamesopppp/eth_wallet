<template>
  <div class="tokenIssue">
      <v-header title="通证发行"></v-header>
      <div class="banner">
          <img src="./banner.png">
      </div>
      <div class="tokenIssue-view fadeInUp animated">
          <div class="tokenIssue-item">
              <span>通证名称(中文):</span>
              <input type="text" placeholder="如:积微通证">
          </div>
          <div class="tokenIssue-item">
              <span>通证简称(大写):</span>
              <input type="text" placeholder="如:GWT">
          </div>
          <div class="tokenIssue-item">
              <span>发行量:</span>
              <input type="text" placeholder="请输入发行数量">
          </div>
          <div class="tokenIssue-item">
              <span>发行单位:</span>
              <input type="text" placeholder="请输入发行单位">
          </div>
          <div class="tokenIssue-item">
              <span>联系人:</span>
              <input type="text" placeholder="联系人名称">
          </div>
          <div class="tokenIssue-item">
              <span>手机号:</span>
              <input type="text" placeholder="手机号码">
          </div>
          <!-- <div class="tokenIssue-item">
              <span>所在地区:</span>
              <span></span>
              <img src="./bottom.png">
          </div> -->
          <v-btn :disabled="submiting" :loading="submiting" class="submit">提交审核</v-btn>
      </div>
  </div>
</template>

<script>
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      submiting: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./tokenIssue.less";
</style>