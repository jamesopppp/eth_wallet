<template>
  <div id="open-home">
    <!-- <img class="bg" src="./bg.png">
    <img class="logo fadeInDown animated" src="./logo.png">
    <v-btn @click="goNext" class="create">创建钱包</v-btn> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    goNext() {
      this.$router.push({ name: "open-create" });
    }
  },
  components: {},
  props: {}
};
</script>
<style lang="less" scoped>
@import "./open-home.less";
</style>