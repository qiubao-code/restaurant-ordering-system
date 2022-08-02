<template>
    <div class="info">
    <el-descriptions
        class="margin-top"
        :column="3"
        :size="size"
        border
    >

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <user />
          </el-icon>
          服务员姓名
        </div>
      </template>
      {{waiter.name}}
      <el-tag size="small">ID:{{waiter.id}}</el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <iphone />
          </el-icon>
          桌号
        </div>
      </template>
      {{tableId}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <location />
          </el-icon>
          订单编号
        </div>
      </template>
      {{orderId}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <tickets />
          </el-icon>
          订单备注
        </div>
      </template>
      {{memo}}
    </el-descriptions-item>
    </el-descriptions>

    <div class="food">
        <el-table :data="todoOrderDetail" stripe border style="box-shadow: var(--el-box-shadow-base);">
            <el-table-column prop="name" label="菜品名称" width="400"></el-table-column>
            <el-table-column prop="num" label="菜品数量" fixed="right"></el-table-column>
<!--            <el-table-column label="烹饪状态" fixed="right">-->
<!--                <template #default="scope">-->
<!--                    <el-dropdown @command="handleCommand">-->
<!--                        <el-button type="primary">-->
<!--                            {{todoOrderDetail[scope.$index].status}}-->
<!--                            <el-icon class="el-icon&#45;&#45;right"><arrow-down /></el-icon>-->
<!--                        </el-button>-->
<!--                        <template #dropdown>-->
<!--                            <el-dropdown-menu>-->
<!--                                <el-dropdown-item :command="{index: scope.$index, command: '准备烹制'}">准备烹制</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{index: scope.$index, command: '正在烹制'}">正在烹制</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{index: scope.$index, command: '烹制完成'}">烹制完成</el-dropdown-item>-->
<!--                            </el-dropdown-menu>-->
<!--                        </template>-->
<!--                    </el-dropdown>-->
<!--                </template>-->
<!--            </el-table-column>-->
        </el-table>
    </div>
        <div>
            <el-button type="primary" @click="back">返回</el-button>
        </div>
    </div>
</template>

<script>
    import { ArrowDown, User, Iphone, Location, Tickets, OfficeBuilding } from '@element-plus/icons-vue';
    import axios from 'axios';
    import { ref } from 'vue';

    export default {
      name: "OrderDetail",

      data () {
        return {
          orderId: 1,
          tableId: 1,
          waiter: {
            id: 1,
            name: "服务员1"
          },
          memo: '订单备注1',

          orderDetail: [
            {
              id: 1,
              name: '菜品1',
              num: 10,
              status: '正在烹制'
            },
            {
              id: 2,
              name: '菜品2',
              num: 11,
              status: '准备烹制'
            },
            {
              id: 3,
              name: '菜品3',
              num: 13,
              status: '烹制完成'
            },
          ],

            todoOrderDetail: [],     // 还未烹饪的菜品列表

            size: '',
        }
      },

        // 计算属性
        computed: {
            iconStyle: function() {
                const size = ref('');
                const marginMap = {
                    large: '8px',
                    default: '6px',
                    small: '4px',
                };
                return {
                    marginRight: marginMap[size.value] || marginMap.default,
                }
            }
        },

      components: {
          ArrowDown,
          User,
          Iphone,
          Location,
          Tickets,
          OfficeBuilding
      },

      methods: {
        handleCommand: function (command) {
          let index = command.index;
          this.todoOrderDetail[index].status = command.command;

          let data = new FormData();
          data.append("order_id", this.orderId);
          data.append("food_id", this.todoOrderDetail[index].id);
          let status;
          console.log(command.command);
          if (command.command === '准备烹制') {
            status = '0';
          } else if (command.command === '正在烹制') {
            status = '1';
          } else {  // 烹制完成
            status = '2';

            // 未烹制的菜品减少
            let temp = [];
            for (let i = 0; i < this.todoOrderDetail.length; i++) {
                if (this.todoOrderDetail[i].id !== this.todoOrderDetail[index].id) {
                    temp.push(this.todoOrderDetail[i]);
                }
            }
            this.todoOrderDetail = temp;

            // 展示列表消失已烹饪完成的菜品
            // temp = [];
            // for (let i = 0; i < this.orderDetail.length; i++) {
            //     if (this.orderDetail[i].id !== this.orderDetail[index].id) {
            //         temp.push(this.orderDetail[i]);
            //     }
            // }
            // this.orderDetail = temp;
          }
          data.append("status", status);
          data.append("table_id", this.tableId);

          // 修改菜品状态, 并向服务员发送传菜消息
          axios.post('/8083api/back-kitchen/detail/status', data).then((res) => {
            console.log(res);
          });
        },

          back: function () {
            window.location.href = 'javascript:history.go(-1)';
          }
      },

      created() {

        // 接收页面传值
        let this_id = this.$route.query.id;
        console.log(this_id);
        
        // 发送请求获取数据信息
        axios.get('/8083api/back-kitchen/detail', {
          params: {
            order_id: this_id
          }
        }).then((res) => {
          let data1 = res.data.data;
          // console.log(data1);
          this.orderId = data1.orderId;
          this.tableId = data1.tableId;
          this.waiter.id = data1.userId;
          this.waiter.name = data1.username;
          this.memo = data1.memo;

          let foods = res.data.data.food;
          let orderDetail = [];
          let todoOrderDetail = [];
          for (let i = 0; i < foods.length; i++) {
            let item = {
              id: foods[i].foodId,
              name: foods[i].foodName,
              num: foods[i].numFood,
            };
            orderDetail.push(item);
            todoOrderDetail.push(item);
          }
          this.orderDetail = orderDetail;
          this.todoOrderDetail = todoOrderDetail;
        });
      }
    }

</script>

<!--<script setup>-->
<!--// 渲染页面-->
<!--import { computed, ref } from 'vue'-->

<!--const size = ref('')-->
<!--const iconStyle = computed(() => {-->
<!--  const marginMap = {-->
<!--    large: '8px',-->
<!--    default: '6px',-->
<!--    small: '4px',-->
<!--  }-->
<!--  return {-->
<!--    marginRight: marginMap[size.value] || marginMap.default,-->
<!--  }-->
<!--})-->
<!--// const blockMargin = computed(() => {-->
<!--//   const marginMap = {-->
<!--//     large: '32px',-->
<!--//     default: '28px',-->
<!--//     small: '24px',-->
<!--//   }-->
<!--//   return {-->
<!--//     marginTop: marginMap[size.value] || marginMap.default,-->
<!--//   }-->
<!--// })-->
<!--</script>-->

<style scoped>
    /*.title {*/
    /*    display: flex;*/
    /*    flex-direction: row;*/
    /*}*/

    /*.waiter {*/
    /*    display: flex;*/
    /*    flex-direction: column;*/
    /*    margin-left: 100px;*/
    /*}*/

    /*.order-memo {*/
    /*    margin-left: 100px;*/
    /*}*/

    /*.el-descriptions {*/
    /*    margin-top: 20px;*/
    /*}*/
    .cell-item {
        display: flex;
        align-items: center;
    }
    .margin-top {
        margin-top: 20px;
        margin-bottom: 30px;
    }

    .info{
        width: 70%;
        margin: 30px auto;
    }

    .food{
        margin: 30px auto;
    }
</style>