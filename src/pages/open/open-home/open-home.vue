<template>
  <div id="open-home">
    <swiper v-model="block" :show-dots="false" dots-position="center" class="home-swiper">
      <swiper-item class="block1">
        <div v-show="block===0" class="block-view fadeInUp animated">
          <img class="banner1" src="./1-banner.png">
          <p class="block1-title">去中心化价值</p>
          <p class="block1-content">基于区块链技术</p>
          <p class="block1-content">全球首创一键通证发行</p>
        </div>
      </swiper-item>
      <swiper-item class="block2">
        <div v-show="block===1" class="block-view fadeInUp animated">
          <img class="banner2" src="./2-banner.png">
          <p class="block2-title">移动资产管理</p>
          <p class="block2-content">区块链数据存储,放心</p>
          <p class="block2-content">军工级数据加密,安全</p>
          <p class="block2-content">随时随地监控资产状况,省心</p>
        </div>
      </swiper-item>
      <swiper-item class="block3">
        <div v-show="block===2" class="block-view fadeInUp animated">
          <img class="banner3" src="./3-banner.png">
          <p class="block3-title">资产流通平台</p>
          <p class="block3-content">保障资产价值,加速资产变现</p>
          <p class="block3-content">扩大投资收益</p>
        </div>
      </swiper-item>
    </swiper>
    <v-btn v-show="block===2" app @click="goNext" class="create">创建钱包</v-btn>
    <div class="point">
      <ul>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div :class="{'move2':block==1,'move3':block===2}" class="line"></div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "vux";
export default {
  data() {
    return {
      block: 0
    };
  },
  created() {},
  mounted() {},
  methods: {
    goNext() {
      this.$router.push({ name: "open-create" });
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./open-home.less";
</style>