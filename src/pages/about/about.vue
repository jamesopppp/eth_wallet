<template>
  <div class="about">
      <v-header title="关于我们"></v-header>
      <div class="about-view">
          <div class="about-head" v-ripple>
              <img src="../../assets/images/default.png">
              <p>当前版本: v1.0.0</p>
          </div>
          <div class="about-list">
              <div class="about-item" v-ripple>使用协议</div>
              <div class="about-item" v-ripple>隐私条例</div>
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
  methods: {},
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./about.less";
</style>