<template>
  <div class="my">
      <div class="head-block">
        <div class="animated bounceInDown" v-ripple>
          <div class="content">
            <img src="../../assets/images/my-wallet.svg">
            <div>管理钱包</div>
          </div>
        </div>
        <div class="animated bounceInDown" v-ripple> 
          <div class="content">
            <img src="../../assets/images/my-record.svg">
            <div>交易记录</div>
          </div>
        </div>
      </div>
      <div class="option-list fadeInDown animated">
        <div class="option-item" v-ripple>
          <img class="option-icon" src="../../assets/images/my-message.svg">
          <span>消息中心</span>
          <i class="iconfont icon-xiangzuojiantou backArrow"></i>
        </div>
        <div class="option-item" v-ripple>
          <img class="option-icon" src="../../assets/images/my-contact.svg">
          <span>联系人</span>
          <i class="iconfont icon-xiangzuojiantou backArrow"></i>
        </div>
        <div class="option-item" v-ripple>
          <img class="option-icon" src="../../assets/images/my-setting.svg">
          <span>系统设置</span>
          <i class="iconfont icon-xiangzuojiantou backArrow"></i>
        </div>
        <div class="option-item" v-ripple>
          <img class="option-icon" src="../../assets/images/my-center.svg">
          <span>个人中心</span>
          <i class="iconfont icon-xiangzuojiantou backArrow"></i>
        </div>
        <div class="option-item" v-ripple>
          <img class="option-icon" src="../../assets/images/my-help.svg">
          <span>帮助中心</span>
          <i class="iconfont icon-xiangzuojiantou backArrow"></i>
        </div>
        <div class="option-item" v-ripple @click="goAbout">
          <img class="option-icon" src="../../assets/images/my-about.svg">
          <span>关于我们</span>
          <i class="iconfont icon-xiangzuojiantou backArrow"></i>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "my",
  data() {
    return {};
  },
  mounted() {
    this.$store.commit("SET_TAB", 2);
  },
  methods: {
    goAbout() {
      this.$router.push({ name: "about" });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./my.less";
</style>