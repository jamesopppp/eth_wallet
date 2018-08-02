<template>
  <div class="addContact">
      <v-header :title="headerText"></v-header>
      <div class="addContact-banner">
          <img src="./banner.png">
      </div>
      <div class="addContact-view fadeInUp animated">
          <div class="addContact-item">
              <p class="item-title">联系人名称</p>
              <input v-model="name" type="text" placeholder="请输入联系人名称">
          </div>
          <div class="addContact-item">
              <p class="item-title">钱包地址</p>
              <input v-model="address" type="text" placeholder="请输入钱包地址">
              <img src="./scan.png"> 
          </div>
          <div class="addContact-item">
              <p class="item-title">手机号码</p>
              <input v-model="tel" type="text" placeholder="请输入手机号码">
          </div>
          <div class="addContact-item">
              <p class="item-title">邮箱地址(选填)</p>
              <input v-model="email" type="text" placeholder="请输入邮箱地址 如geewer@163.com">
          </div>
          <v-btn :disabled="isSave" :loading="isSave" @click.native="saveContact" class="saveContact">保存</v-btn>
      </div>
      <v-snackbar :timeout="1500" auto-height color="info" bottom v-model="toast">
          {{ toastText }}
          <v-btn dark flat @click="toast = false">
              关闭
          </v-btn>
      </v-snackbar>
  </div>
</template>

<script>
import { getStore, objIsNull, setStore } from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      name: "",
      address: "",
      tel: "",
      email: "",
      toast: false,
      toastText: "",
      isSave: false,
      ownAddress: "",
      addContact: true,
      headerText: "新建联系人",
      editItem: {},
      editIndex: 0
    };
  },
  created() {
    let that = this;
    that.ownAddress = JSON.parse(getStore("walletList"))[0].wallet.address;
    let isAdd = that.$route.query.isAdd;
    if (isAdd === 0) {
      that.editIndex = that.$route.query.index;
      that.addContact = false;
      that.headerText = "编辑联系人";
      that.editItem = JSON.parse(getStore("walletList"))[0].contacts[
        that.editIndex
      ];
      that.name = that.editItem.name;
      that.address = that.editItem.address;
      that.tel = that.editItem.phone;
      that.email = that.editItem.email;
    }
  },
  mounted() {},
  methods: {
    saveContact() {
      let that = this;
      let re = /^1\d{10}$/;
      let emailRe = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
      if (objIsNull(that.name)) {
        that.toastText = "请输入联系人姓名";
        that.toast = true;
        return;
      }
      if (that.name.length > 10) {
        that.toastText = "联系人姓名请少于10个字符";
        that.toast = true;
        return;
      }
      if (objIsNull(that.address)) {
        that.toastText = "请输入钱包地址";
        that.toast = true;
        return;
      }
      try {
        that.address = that.ethers.utils.getAddress(that.address);
      } catch (e) {
        that.toastText = "钱包地址输入错误";
        that.toast = true;
        return;
      }
      if (objIsNull(that.tel)) {
        that.toastText = "请输入手机号码";
        that.toast = true;
        return;
      }
      if (!re.test(that.tel)) {
        that.toastText = "手机号码输入错误";
        that.toast = true;
        return;
      }
      if (!objIsNull(that.email)) {
        if (!emailRe.test(that.email)) {
          that.toastText = "邮箱地址输入错误";
          that.toast = true;
          return;
        }
      }
      if (
        that.address.toLowerCase().toString() ===
        that.ownAddress.toLowerCase().toString()
      ) {
        that.toastText = "联系人钱包地址与自己的钱包地址重复";
        that.toast = true;
        return;
      }
      that.isSave = true;
      let newContacts = {
        name: that.name,
        address: that.address,
        phone: that.tel,
        email: that.email
      };
      let walletList = JSON.parse(getStore("walletList"));
      let contacts = walletList[0].contacts;
      let flag = true;
      if (contacts) {
        for (let i = 0, len = contacts.length; i < len; i++) {
          if (
            contacts[i].address.toLowerCase().toString() ===
            that.address.toLowerCase().toString()
          ) {
            flag = false;
            break;
          }
        }
      }
      if (!flag && that.addContact) {
        that.toastText = "该联系人钱包地址已添加";
        that.toast = true;
        that.isSave = false;
        return;
      }

      if (that.addContact) {
        console.log("添加联系人");
        if (contacts) {
          walletList[0].contacts.push(newContacts);
        } else {
          let contactsList = [];
          contactsList.push(newContacts);
          walletList[0].contacts = contactsList;
        }
      } else {
        walletList[0].contacts[that.editIndex].name = that.name;
        walletList[0].contacts[that.editIndex].address = that.address;
        walletList[0].contacts[that.editIndex].phone = that.tel;
        walletList[0].contacts[that.editIndex].email = that.email;
      }
      setStore("walletList", walletList);
      console.log(walletList[0]);
      that.toastText = "保存成功";
      that.toast = true;
      setTimeout(() => {
        that.isSave = false;
        that.$router.go(-1);
      }, 1000);
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./addContact.less";
</style>