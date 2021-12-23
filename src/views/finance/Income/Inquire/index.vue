<template>
  <div class="record-content">
    <p class="record-title">
      <span>温馨提示：线下汇款后，您的款项具体到账时间依赖于银行系统，请耐心等待。常见问题可查看 </span><a>充值说明</a>
    </p>
    <div class="search">
      <a-input-group compact
                     enterButton="true">
        <a-select default-value="汇款银行">
          <a-select-option value="汇款银行"> 汇款银行 </a-select-option>
          <a-select-option value="汇款账号"> 汇款账号 </a-select-option>
          <a-select-option value="汇款户名"> 汇款户名 </a-select-option>
        </a-select>
        <a-input-search style="width: 250px"
                        placeholder="请输入搜索关键词"
                        enter-button
                        @search="onSearch" />
        <span class="refresh">
          <a-icon type="reload" />
        </span>
      </a-input-group>
    </div>
    <div>
      <a-table :columns="columns"
               :data-source="data"
               @change="handleChange">
        <div slot="action"
             slot-scope="text">
          <a-button type="link"
                    @click="seeDetails">查看详情</a-button>
        </div>
      </a-table>
    </div>
    <div class="modal-details"
         v-show="isinfo">
      <div class="modal-details-info">
        <div class="modal-details-title">
          <span>线下汇款详情</span>
          <span @click="isinfo = false">
            <a-icon type="close" />
          </span>
        </div>
        <div class="modal-details-type">
          <div class="modal-details-type-info">
            <h1>收款方信息</h1>
            <div class="modal-details-type-list">
              <div><span class="modal-details-key">汇款账户名称:</span><span class="modal-details-value">浙江云盾互联网科技有限公司</span></div>
              <div><span class="modal-details-key">银行账户:</span><span class="modal-details-value">333222333454545455</span></div>
              <div><span class="modal-details-key">开户银行:</span><span class="modal-details-value">中国建设银行</span></div>
              <div><span class="modal-details-key">汇款备注:</span><span class="modal-details-value">2021年12月23日</span></div>
            </div>
          </div>
          <div class="modal-details-type-info">
            <h1>充值信息</h1>
            <div class="modal-details-type-list">
              <div><span class="modal-details-key">汇款人ID:</span><span class="modal-details-value">1000021</span></div>
              <div><span class="modal-details-key">汇款人手机:</span><span class="modal-details-value">33322233</span></div>
              <div><span class="modal-details-key">汇款金额:</span><span class="modal-details-value">23333</span></div>
              <div><span class="modal-details-key">汇款户名:</span><span class="modal-details-value">张三</span></div>
              <div><span class="modal-details-key">汇款账号:</span><span class="modal-details-value">4795656565322533</span></div>
              <div><span class="modal-details-key">汇款银行:</span><span class="modal-details-value">招商银行</span></div>
              <div><span class="modal-details-key">汇款凭证:</span>
                <p class="img-url "><img src="https://cn.bing.com/th?id=OHR.ManitobaBears_ZH-CN5877672648_1920x1080.jpg&rf=LaDigue_1920x1080.jpg"
                       alt=""></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isinfo: false,
      data: [
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "New York No. 1 Lake Park"
        },
        {
          key: "2",
          name: "Jim Green",
          age: 42,
          address: "London No. 1 Lake Park"
        }
      ],
      columns: [
        {
          title: "汇款账户",
          dataIndex: "name",
        },
        {
          title: "账户名称",
          dataIndex: "title",
        },
        {
          title: "汇款金额",
          dataIndex: "age",
          key: "age",
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: "汇款日期",
          dataIndex: "address",
          key: "address",
          sorter: (a, b) => a.address.length - b.address.length,
        },
        {
          title: "审核状态",
          key: "store",
        },
        {
          title: "操作",
          dataIndex: "id",
          key: "action",
          scopedSlots: {
            customRender: "action"
          }
        }
      ],
    };
  },

  methods: {
    onSearch (value) {
      console.log(value);
    },
    seeDetails () {
      this.isinfo = true;
    },
    handleChange (pagination, filters, sorter) {
      console.log("Various parameters", pagination, filters, sorter);
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
    },
    clearFilters () {
      this.filteredInfo = null;
    },
    clearAll () {
      this.filteredInfo = null;
      this.sortedInfo = null;
    },
    setAgeSort () {
      this.sortedInfo = {
        order: "descend",
        columnKey: "age"
      };
    }
  }
};
</script>

<style lang="less" scoped>
.table-operations {
  margin-bottom: 16px;
}
.table-operations > button {
  margin-right: 8px;
}
.record-content {
  .record-title {
    padding: 7px 22px 5px 37px;
    background: #fff3eb url(../../../../assets/img/pay/ExclamationMark.png)
      no-repeat 10px 8px;
    min-height: 32px;
    border: 1px solid #ffda95;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
  }
  .search {
    margin-bottom: 20px;
  }
  .refresh {
    float: right;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border: 1px solid #d9d9d9;
    font-size: 17px;
  }
  .img-url {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-left: 20px;
    img {
      width: 100%;
    }
  }
  .modal-details {
    position: absolute;
    top: -56px;
    left: -328px;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.466);
    .modal-details-info {
      background-color: #fff;
      width: 63%;
      height: 70%;
    }
    .modal-details-title {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      padding: 20px;
      display: flex;
      color: #333;
      justify-content: space-between;
      background-color: #f2f2f2;
    }
    .modal-details-type {
      padding: 30px;
    }
    .modal-details-type-info {
      h1 {
        font-size: 15px;
        padding: 10px;
      }
      .modal-details-type-list {
        display: flex;
        flex-wrap: wrap;
        padding-left: 60px;
        font-size: 13px;
        color: #333333;
        div {
          width: 30%;
          line-height: 50px;
          .modal-details-key {
            display: inline-block;
            width: 100px;
            text-align: right;
          }
          .modal-details-value {
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>
