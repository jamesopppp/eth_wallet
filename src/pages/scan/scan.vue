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
        QRScanner.scan(displayContents);
        function displayContents(err, text) {
          if (err) {
            console.error(err);
          } else {
            alert(text);
            QRScanner.disableLight();
            QRScanner.hide();
            QRScanner.cancelScan();
            QRScanner.destroy();
            that.$router.go(-1);
          }
        }
        QRScanner.show();
      } else if (status.denied) {
        alert("被拒绝");
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