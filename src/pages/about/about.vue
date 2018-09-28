<template>
  <div class="about">
      <v-header title="关于我们"></v-header>
      <div class="about-view fadeInUp animated">
          <div class="about-head" v-ripple>
              <img class="jello animated" src="../../assets/images/logo-blue.png">
              <p>当前版本: v1.0.1 beta</p>
          </div>
          <div class="about-list">
              <div @click="goContactUs" class="about-item" v-ripple>联系我们</div>
              <div @click="goServiceAgreement" class="about-item" v-ripple>服务协议</div>
              <div @click="goPrivacyAgreement" class="about-item" v-ripple>隐私条例</div>
              <div class="about-item" v-ripple>版本日志</div>
              <div class="about-item" v-ripple>产品向导</div>
              <div class="about-item" v-ripple>检测新版本</div>
          </div>
          <div class="about-company">
              <p>Copyright© 2018 Geewer all right reserved</p>
          </div>
      </div>
  </div>
</template>

<script>
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    goContactUs() {
      this.$router.push({ name: "contactUs" });
    },
    goServiceAgreement() {
      // this.$router.push({ name: "serviceAgreement" });
    },
    goPrivacyAgreement() {
      // this.$router.push({ name: "privacyAgreement" });
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./about.less";
</style>