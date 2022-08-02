<template>
    <el-card class="box-card">
        <!-- 分栏 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 搜索框 -->
                <el-input
                 placeholder="输入服务员姓名或订单编号查询"
                 v-model="queryInfo.query"
                 clearable @clear="getOrderList">
                <template #append>
                    <el-button @click="getUserList">搜索</el-button>
                </template>
                </el-input>

            </el-col>
        </el-row>
        <!-- 订单列表区域 -->
        <transition>
            <el-table
            :data="orderlistdata.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            v-model="orderlistdata"
            style="width: 100%"
            stripe
            :default-sort = "{prop: 'date', order: 'descending'}">
            <!-- <el-table 
            :data="orderlistdata" 
            v-model="orderlistdata" 
            style="width: 100%"
            stripe
            :default-sort = "{prop: 'date', order: 'descending'}"
            
            > -->
                <el-table-column
                prop="orderId"
                label="订单编号"
                sortable
                width="120">
                </el-table-column>

                <el-table-column
                prop="tableId"
                label="订单桌号"
                sortable
                width="120">
                </el-table-column>

                <el-table-column
                prop="totalprice"
                label="订单总额"
                sortable
                width="120">
                </el-table-column>
                    
                <el-table-column
                prop="waitername"
                label="服务员姓名"
                width="120">
                </el-table-column>
                
                <el-table-column
                label="操作"
                width="240px">
                    <template v-slot="scope">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-button type="primary" @click="goToManageOrder(scope.row.orderId)">详情</el-button>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </transition>
        <!-- 页面区域 -->
        <div class="block" style="margin-top:15px">
            <el-pagination 
            align='center' 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="currentPage" 
            :page-sizes="[1,5,10,20]" 
            :page-size="pageSize" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="orderlistdata.length">
            </el-pagination>
        </div>
    </el-card>
</template>
 <style>
    .v-enter,
    .v-leave-to {
        opacity: 0;
        transform: translateY(80px);
    }

    .v-enter-active,
    .v-leave-active {
        transition: all 0.6s ease;
    }

    /* 下面的 .v-move 和 .v-leave-active 配合使用，能够实现列表后续的元素，渐渐地漂上来的效果 */
    .v-move {
        transition: all 0.6s ease;
    }

    .v-leave-active {
        position: absolute;
    }
</style>
<script>
import { ElMessageBox, ElMessage } from 'element-plus'
import axios from 'axios';

export default {
    el:"#manageorder",
    data(){
        return {
            // 搜索
            queryInfo:{
                query:'', // 查询参数
                pagenum:1, // 当前页码
                pageSize:7 // 每页显示条数
            },
            // 获取订单列表的参数对象
            currentPage:1,
            total:null,
            pageSize:7,
            // qiu测试
            deviceList:[],
            // 筛选后的数据
            resultList:[],
            // 搜索不到数据
            isShowTip:false,
            // 订单列表
            orderlistdata:[
                {
                    orderId: 1,
                    tableId: 1,
                    totalprice: 1,
                    waitername: 'hh',
                    status:null,

                }
            ],
            orderlistdata2:[
                {
                    orderId: 1,
                    tableId: 1,
                    totalprice: 1,
                    waitername: 'hh'
                }
            ],
            
        }
    },
    created(){
        // axios.get('http://localhost:3000/pagelist').then((res)=>{
        //     console.log(res);
        //     this.deviceList=res.data.deviceList;
        // });
         axios.get('/8081api/order/finishList').then((res) => {
                // console.log(res.data);
                // let temp = res.data.data;
                let temp = res.data.data;
                console.log(temp);
                let orderlistdata = [];
                for (let i = 0; i < temp.length; i++) {
                        let item = {
                        orderId: temp[i].orderId,
                        tableId: temp[i].tableId,
                        totalprice: temp[i].totalPrice,
                        waitername: temp[i].username,
                        status:temp[i].status
                    };
                    orderlistdata.push(item);
                }
                this.orderlistdata = orderlistdata;
                console.log(this.orderlistdata.status);
                this.orderlistdata2 = orderlistdata;
            });
           
    },
    methods:{
        // 监听 page size 改变的事件
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        // 监听 页码值 改变的事件
        handleCurrentChange (val) {
             console.log(`当前页: ${val}`);
            this.currentPage = val;
        },
        //跳转到详细信息
        goToManageOrder:function(id) {
            // console.log(id);
            // localStorage.setItem("orderId", id);
            // window.location.href = "/#/order_detail";
            // this.$router.push({
            //     path: "/order_detail",
            //     query: { id: id }
            // })
            window.open("/#/order_detail?id="+id)
        },
        // 搜索框实现
        getUserList: function () {
            // 处理空白
            if (this.queryInfo.query === '') {
                this.orderlistdata = this.orderlistdata2;
                return;
            }

            let temp = [];
            for (let i = 0; i < this.orderlistdata2.length; i++) {
                if (this.queryInfo.query === (this.orderlistdata2[i].orderId + "") ||
                    this.queryInfo.query === (this.orderlistdata2[i].tableId + "") ||
                    this.queryInfo.query === (this.orderlistdata2[i].totalprice + "") ||
                    this.orderlistdata2[i].waitername.indexOf(this.queryInfo.query) !== -1) {
                    temp.push(this.orderlistdata2[i]);
                }
            }
            this.orderlistdata = temp;
        }
         
    },

}
</script>