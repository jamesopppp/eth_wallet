<template>
  <div class="transfer">
      <v-header :title="token+'转账'" scan></v-header>
      <div class="transfer-view">
          <div class="transfer-from">
              <div class="one-line">
                  <span>收款人钱包地址</span>
                  <img src="./people.png">
              </div>
              <div class="address">
                <input v-model="address" type="text" placeholder="钱包地址">
              </div>
              <div class="two-line">
                  <div>
                      <p>转账金额</p>
                      <input v-model="amount" type="text" placeholder="金额">
                  </div>
                  <div>
                      <p>备注</p>
                      <input type="text" placeholder="备注">
                  </div>
              </div>
              <div class="payTitle">
                  <span>矿工费用</span>
                  <img src="./help.png">
              </div>
              <v-slider :min="minVal" :max="maxVal" inverse-label v-model="sliderVal"></v-slider>
              <div class="slider-tip">
                  <span>慢</span>
                  <span>{{sliderVal}} ether</span>
                  <span>快</span>
              </div>
          </div>
          <v-btn class="next">提交</v-btn>
      </div>
  </div>
</template>

<script>
import { objIsNull } from "@/config/utils";
import { mapState } from "vuex";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      maxVal: 1000,
      minVal: 10,
      sliderVal: 10,
      address: "",
      amount: 0,
      token: "ETH"
    };
  },
  created() {
    if (Object.keys(this.transfer).length != 0) {
      this.address = this.transfer.address;
      this.amount = this.transfer.amount;
      this.token = this.transfer.token;
    }
  },
  mounted() {},
  beforeDestroy() {
    this.$store.commit("SET_TRANSFER", {});
  },
  methods: {},
  components: {
    vHeader
  },
  computed: {
    ...mapState(["transfer"])
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./transfer.less";
</style>