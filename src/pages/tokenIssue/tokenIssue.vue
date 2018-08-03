<template>
  <div class="tokenIssue">
      <v-header title="通证发行"></v-header>
      <div class="tokenIssue-view fadeInUp animated">
          <div class="banner">
              <img src="./banner.png">
          </div>
          <div class="tokenIssue-item">
              <span>通证名称(中文):</span>
              <input v-model="tokenName" maxlength="10" type="text" placeholder="如:积微通证">
          </div>
          <div class="tokenIssue-item">
              <span>通证简称(大写):</span>
              <input v-model="tokenSymbol" maxlength="8" type="text" placeholder="如:GWT">
          </div>
          <div class="tokenIssue-item">
              <span>发行量:</span>
              <input @blur="outInput" v-model="tokenAmount" type="text" placeholder="请输入发行数量">
          </div>
          <div class="tokenIssue-item">
              <span>发行单位:</span>
              <input maxlength="20" v-model="tokenUnit" type="text" placeholder="请输入发行单位">
          </div>
          <div class="tokenIssue-item">
              <span>联系人:</span>
              <input maxlength="10" v-model="tokenContact" type="text" placeholder="联系人名称">
          </div>
          <div class="tokenIssue-item">
              <span>手机号:</span>
              <input maxlength="11" v-model="tokenPhone" type="text" placeholder="手机号码">
          </div>
          <!-- <div class="tokenIssue-item">
              <span>所在地区:</span>
              <span></span>
              <img src="./bottom.png">
          </div> -->
          <v-btn @click="submit" :disabled="submiting" :loading="submiting" class="submit">提交审核</v-btn>
      </div>
      <v-dialog content-class="backup-success-pop" persistent max-width="240" v-model="successTip">
          <img src="./success.png">
          <p class="backup-success-title">通证发行</p>
          <p class="backup-success-content">一旦确认将立即申请该通证发行,是否已经确认通证信息?</p>
          <v-btn @click="confirm" class="backup-success-confirm">确认</v-btn>
          <v-btn @click="cancel" class="backup-success-cancel">取消</v-btn>
      </v-dialog>
      <v-dialog content-class="backup-fail-pop" persistent max-width="220" v-model="submitOK">
          <img src="./success.png">
          <p class="backup-fail-title">提交成功</p>
          <p class="backup-fail-content">您的通证发行申请已提交,请耐心等待</p>
          <v-btn @click="sureSubmit" class="backup-fail-know">确定</v-btn>
      </v-dialog>
      <v-snackbar :timeout="1500" auto-height color="info" bottom v-model="toast">
          {{ toastText }}
          <v-btn dark flat @click="toast = false">
              关闭
          </v-btn>
      </v-snackbar>
  </div>
</template>

<script>
import { objIsNull } from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      submiting: false,
      successTip: false,
      tokenName: "",
      tokenSymbol: "",
      tokenAmount: 0,
      tokenUnit: "",
      tokenContact: "",
      tokenPhone: "",
      toastText: "",
      toast: false,
      submitOK: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    confirm() {
      this.tokenName = "";
      this.tokenSymbol = "";
      this.tokenAmount = 0;
      this.tokenUnit = "";
      this.tokenContact = "";
      this.tokenPhone = "";
      this.successTip = false;
      setTimeout(() => {
        this.submiting = false;
        this.submitOK = true;
      }, 1500);
    },
    sureSubmit() {
      this.$router.go(-1);
    },
    submit() {
      let that = this;
      let reText = /^[\u4e00-\u9fa5]+$/;
      let reUpper = /^[A-Z]+$/;
      let reAmount = /^\d+(\.\d+)?$/;
      let rePhone = /^1\d{10}$/;
      if (objIsNull(that.tokenName)) {
        that.toastText = "请输入通证名称(中文)";
        that.toast = true;
        return;
      }
      if (!reText.test(that.tokenName)) {
        that.toastText = "请输入中文通证名称";
        that.toast = true;
        return;
      }
      if (!reUpper.test(that.tokenSymbol) || objIsNull(that.tokenSymbol)) {
        that.toastText = "请输入简称(大写)";
        that.toast = true;
        return;
      }
      if (objIsNull(that.tokenAmount) || that.tokenAmount == 0) {
        that.toastText = "请输入发行数量";
        that.toast = true;
        return;
      }
      if (objIsNull(that.tokenUnit)) {
        that.toastText = "请输入发行单位";
        that.toast = true;
        return;
      }
      if (objIsNull(that.tokenContact)) {
        that.toastText = "请输入联系人";
        that.toast = true;
        return;
      }
      if (objIsNull(that.tokenPhone)) {
        that.toastText = "请输入手机号码";
        that.toast = true;
        return;
      }
      if (!rePhone.test(that.tokenPhone)) {
        that.toastText = "请输入正确手机号码";
        that.toast = true;
        return;
      }
      that.submiting = true;
      that.successTip = true;
    },
    cancel() {
      this.submiting = false;
      this.successTip = false;
    },
    outInput() {
      this.tokenAmount = this.number_format(this.tokenAmount, 0, ".", ",");
    },
    number_format(number, decimals, dec_point, thousands_sep) {
      /*
        * 参数说明：
        * number：要格式化的数字
        * decimals：保留几位小数
        * dec_point：小数点符号
        * thousands_sep：千分位符号
        * */
      number = (number + "").replace(/[^0-9+-Ee.]/g, "");
      let n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
        dec = typeof dec_point === "undefined" ? "." : dec_point,
        s = "",
        toFixedFix = function(n, prec) {
          let k = Math.pow(10, prec);
          return "" + Math.ceil(n * k) / k;
        };

      s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
      let re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
      }

      if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
      }
      return s.join(dec);
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./tokenIssue.less";
</style>