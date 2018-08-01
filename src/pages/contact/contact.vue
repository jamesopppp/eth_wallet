<template>
  <div class="contact">
      <v-header add title="联系人"></v-header>
      <div class="contact-view">
          <div v-show="noContact">
            <div class="noContact">
                <img src="../../assets/images/logo-white.png">
            </div>
            <span class="noText">暂无联系人</span>
          </div>
          <div class="contact-list">
              <div class="contact-item" v-ripple v-for="n in 5">
                  <img src="../../assets/images/logo-white.png">
                  <div class="content">
                      <span>Pan LI</span>
                      <span>0x4f2dca7460d74225240a1A83bB61FDA4551D05B4</span>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      noContact: false
    };
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
@import "./contact.less";
</style>