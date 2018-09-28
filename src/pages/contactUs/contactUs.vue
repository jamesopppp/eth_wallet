<template>
  <div class="contactUs">
      <v-header title="联系我们"></v-header>
      <div class="contactUs-view">
          <img class="banner" src="./banner.png">
          <div class="fadeInUp animated">
            <p class="email">联系邮箱:</p>
            <v-btn  @click="goCopy" :disabled="copying" :loading="copying" class="copy">{{email}}</v-btn>
            <p class="tip">(点此复制邮箱地址)</p>
          </div>
      </div>
  </div>
</template>

<script>
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      copying: false,
      email: "jamessupermail@163.com"
    };
  },
  created() {},
  mounted() {},
  methods: {
    goCopy() {
      let that = this;
      that.copying = true;
      that.$copyText(that.email).then(
        function(e) {
          setTimeout(() => {
            that.copying = false;
            that.email = "邮箱复制成功";
            setTimeout(() => {
              that.email = "jamessupermail@163.com";
            }, 1000);
          }, 1000);
        },
        function(e) {
          that.copying = false;
          console.log(e);
        }
      );
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./contactUs.less";
</style>