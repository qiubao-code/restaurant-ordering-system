<template>
<!-- 责任人：qiu change -->
<el-card class="box-card" style="width:90%">
    <div class="demo-collapse">
        <el-collapse
        v-model="activeName"
        @change="handleChange">
            <!-- <el-collapse-item name="2" title="返回" @click="goBack()"></el-collapse-item> -->
            <el-collapse-item title="订单详情" name="1">
                <div>订单编号:{{orderData.orderid}}</div>
                <div>订单桌号:{{orderData.tableid}}</div>
                <div>服务员姓名:{{orderData.waitername}}</div>
                <div>服务员编号:{{orderData.waiterid}}</div>
                <div>订单总价:{{orderData.orderprice}}</div>
                <div>订单状态:{{orderData.status}}</div>
                <div>订单备注:{{orderData.memo}}</div>
                <div>订单开始时间:{{orderData.createtime}}</div>
            </el-collapse-item>
        </el-collapse>
    </div>
    <!-- <template #header> -->
        <!-- <div class="card-header"> -->
            <!-- 订单信息 -->
            <!-- <el-tag class="ml-2">订单编号   {{orderData.orderid}}</el-tag>
            <el-tag class="ml-2" type="success">订单桌号   {{orderData.tableid}}</el-tag>
            <el-tag class="ml-2" type="info">服务员姓名   {{orderData.waiterid}}</el-tag>
            <el-tag class="ml-2" type="warning">服务员姓名   {{orderData.waitername}}</el-tag>
        </div>
    </template> -->
    <!-- 描述列表 -->
<!-- <el-card class="box-card" style="width:80%"> -->
    <el-table :data="tableData" 
        v-model="tableData" 
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
            <el-table-column
            prop="id"
            label="菜品编号"
            sortable
            width="180">
            </el-table-column>

            <el-table-column
            prop="name"
            label="菜品名称"
            sortable
            width="180">
            </el-table-column>

            <el-table-column
            prop="price"
            label="菜品价格"
            sortable
            width="180">
            </el-table-column>
            
            <el-table-column
            prop="status"
            label="菜品状态"
            width="180">
            </el-table-column>
        </el-table>
    </el-card> 
</template>

<script setup>
import { ref } from 'vue'

const activeName = ref('1')
</script>

<script>
import axios from 'axios'

export default {
    el:'#orderdetail',
    data(){
        return{
            orderData:{
                orderid:1,
                tableid:1,
                orderprice:1.9,
                status:'',
                waiterid:1,
                waitername:"qiubao",
                memo:'',
                createtime:''
            },
            orderid:0,
            tableData:[{
                id:1,
                name:'',
                price:1,
                status:'',
            },{
                id:2,
                name:'',
                price:2,
                status:'',
            }]
        }
    },
    created(){
        // console.log(localStorage.getItem("orderId"))
        // 接收页面传值
        var this_id = this.$route.query.id

        // axios.get('/8081api/order/all_detail_info',{
        axios.get('/8081api/order/all_detail_info',{
            params: {
                id:this_id
            }
        }).then((res)=>{
            console.log('res:',res.data.data);
            // this.user_data=res.data.data
            // 桌号 订单编号 服务员编号姓名 订单总价 订单状态与 备注 菜品数量 订单开始时间
            this.orderData.orderid=res.data.data.order.orderId;
            this.orderData.tableid=res.data.data.order.tableId;
            this.orderData.waiterid=res.data.data.waiter.userId;
            this.orderData.waitername=res.data.data.waiter.username;
            this.orderData.orderprice=res.data.data.order.totalPrice;
            this.orderData.status=res.data.data.order.status;

            if(this.orderData.status===0){
                this.orderData.status = '未支付';
            }else{
                this.orderData.status = '已支付';
            }

            this.orderData.memo=res.data.data.order.memo;
            this.orderData.createtime=res.data.data.order.createTime;
            let temp = res.data.data.foodList;

            console.log(res.data.data.foodList);
            let tableData =[];
            
            for(let i=0;i<temp.length;i++){
                let item={
                    id:temp[i].foodId,
                    name:temp[i].foodName,
                    price:temp[i].price,
                    status:temp[i].isAvailable
                };
                
                if(item.status === 1) {
                    item.status = "可售";
                }
                else if(item.status === 0) {
                    item.status = "售罄";
                }
            
                tableData.push(item);
            }
            this.tableData = tableData;
        })
    },
    methods: {
        goBack: function(){
            this.$router.go(-1)
        }
    }
}
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 18px;
  color: rgb(144, 147, 153);
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>