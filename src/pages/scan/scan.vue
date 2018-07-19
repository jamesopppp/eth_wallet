<template>
  <div id="scan">
    <v-header title="付款"></v-header>
    <div class="mask">
      <div class="box">
        <img @click="open" v-if="!status" class="shoud" src="./shoud-off.png">
        <img @click="close" v-else class="shoud" src="./shoud-open.png">
        <img class="borderBox" src="./box.png">
        <span v-if="!status" class="tip">轻点照亮</span>
        <span v-else class="tip">轻点关闭</span>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      status: false
    };
  },
  created() {
    let that = this;
    QRScanner.prepare(onDone); // show the prompt
    function onDone(err, status) {
      if (err) {
        console.error(err);
      }
      if (status.authorized) {
        alert("已授权");
        QRScanner.show();
        QRScanner.scan(displayContents);
        function displayContents(err, txt) {
          if (err) {
            console.error(err);
            console.log("扫描报错");
          } else {
            alert(txt);
            that.setQRval(txt);
            QRScanner.disableLight();
            QRScanner.hide();
            QRScanner.cancelScan();
            QRScanner.destroy();
            that.$router.replace({ name: "transfer" });
          }
        }
      } else if (status.denied) {
        console.log("被拒绝");
      } else {
        console.log("下次再问");
      }
    }
  },
  mounted() {},
  beforeDestroy() {
    QRScanner.disableLight();
    QRScanner.hide();
    QRScanner.cancelScan();
    QRScanner.destroy();
  },
  methods: {
    open() {
      this.status = true;
      QRScanner.enableLight();
    },
    close() {
      this.status = false;
      QRScanner.disableLight();
    },
    setQRval(txt) {
      let amount, token;
      let initalAddress = txt.split("?")[0].substr(5);
      let address = this.ethers.utils.getAddress(initalAddress);
      let valList = txt.split("?")[1].split("&");
      for (let i = 0, len = valList.length; i < len; i++) {
        let name = valList[i].split("=")[0];
        let val = valList[i].split("=")[1];
        if (name == "amount") {
          amount = val;
        }
        if (name == "token") {
          token = val;
        }
      }
      let transfer = {
        address: address,
        amount: amount,
        token: token
      };
      this.$store.commit("SET_TRANSFER", transfer);
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./scan.less";
</style>