<template>
  <div class="home">
    <div class="wavesBox fadeInDown animated">
        <div class="box-bg">
        </div>
        <div class="view">
          <img class="logo" src="../../assets/images/default.png">
          <p class="name">James</p>
          <p class="code">{{address}}</p>
          <img class="qc" @click="goTab" src="../../assets/images/qc.svg">
          <div class="money"><span>总资产($)</span><span>&asymp;</span><span>0</span></div>
        </div>
    </div>
    <div class="bitList fadeInUp animated">
      <div class="list-item" v-ripple>
        <p class="name">HLC</p>
        <div class="logo">
          <img src="../../assets/images/logo.png">
        </div>
        <div class="money">
          <p>0.00</p>
          <p>&asymp;$0</p>
        </div>
      </div>
      <div class="list-item" v-ripple>
        <p class="name">ETH</p>
        <div class="logo">
          <img src="../../assets/images/logo.png">
        </div>
        <div class="money">
          <p>0.00</p>
          <p>-</p>
        </div>
      </div>
      <div class="list-item" v-ripple>
        <p class="name">LXT</p>
        <div class="logo">
          <img src="../../assets/images/logo.png">
        </div>
        <div class="money">
          <p>0.00</p>
          <p>-</p>
        </div>
      </div>
      <div class="list-item" v-ripple>
        <p class="name">BCX</p>
        <div class="logo">
          <img src="../../assets/images/logo.png">
        </div>
        <div class="money">
          <p>0.00</p>
          <p>&asymp;$0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "home",
  data() {
    return {};
  },
  created() {
    this.$store.commit("SET_TAB", 0);
  },
  methods: {
    goTab() {
      this.$router.push({ name: "transaction" });
    }
  },
  computed: {
    ...mapState(["address"])
  }
};
</script>

<style lang="less" scoped>
@import "./home.less";
</style>