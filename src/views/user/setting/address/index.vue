<template>
  <div>
    <h2>常用地址管理</h2>
    <div class="alert-warn">
      <p>1、常用地址最多可添加至5个。</p>
      <p>2、应中国邮政规定，收件人需实名制，请您 <a href="">填写全名</a>。</p>
    </div>
    <a-button class="add-address" icon="plus" type="primary">
      新增地址
    </a-button>
    <div>
      <a-table :columns="columns" :data-source="data">
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      columns: [
        {
          title: "联系人姓名",
          key: "name",
          width: "200px"
        },
        {
          title: "手机号",
          key: "area",
          width: "200px"
        },
        {
          title: "地址",
          key: "address",
          width: "200px"
        },
        {
          title: "邮编",
          key: "phone",
          width: "200px"
        },
        {
          title: "操作",
          key: "actions",
          scopedSlots: { customRender: "actions" }
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.add-address {
  margin: 20px 0;
}
.alert-warn {
  margin-top: 20px;
  padding: 7px 22px 5px 37px;
  background: #fff3eb url(../../../assets/img/pay/ExclamationMark.png) no-repeat
    10px 8px;
  min-height: 32px;
  border: 1px solid #ffdac2;
  border-radius: 2px;
  color: #f60;
  font-size: 12px;
  p:first-child {
    margin-buttom: 10px;
  }
  p:last-child {
    margin-bottom: 0;
  }
}
</style>
