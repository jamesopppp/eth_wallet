<template>
  <div class="codeView">
    <swiper height="100%" :show-dots="false" @on-index-change="onSwiperItemIndexChange" v-model="swiperItemIndex">
      <swiper-item class="swiper-demo-img" v-for="(item, index) in items" :key="index">
        <img :src="item.src">
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "vux";
export default {
  data() {
    return {
      swiperItemIndex: 1,
      items: [
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
        }
      ]
    };
  },
  created() {},
  mounted() {},
  methods: {
    onSwiperItemIndexChange(index) {
      console.log("demo item change", index);
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
</style>