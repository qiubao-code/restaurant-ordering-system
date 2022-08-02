<template>
    <div class="total-div">

    <!-- 服务生销售榜 -->
    <el-card class="box-card">
        <!-- 标题 -->
        <p class="info">服务生销售榜</p>

        <!-- 分栏 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 搜索框 -->
                <el-input class="search"
                 placeholder="请输入服务员姓名或编号"
                 v-model="queryInfo.query"
                 clearable @clear="getResult" @change="getResult">
                <template #append>
                    <el-button @click="getResult">搜索</el-button>
                </template>
                </el-input>
            </el-col>
        </el-row>
        
        <!-- 列表区域 -->
        <transition>
            <el-table
            :data="userList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            v-model="userList"
            style="width: 100%"
            stripe
            :default-sort = "{prop: 'date', order: 'descending'}">
                <el-table-column
                prop="sales"
                label="接单总数"
                sortable
                width="120">
                </el-table-column>

                <el-table-column
                prop="userId"
                label="服务员编号"
                sortable
                width="120">
                </el-table-column>

                <el-table-column
                prop="username"
                label="服务员姓名"
                sortable
                width="120">
                </el-table-column>
                
                <el-table-column
                label="操作"
                width="240px">
                    <template v-slot="scope">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-button type="primary" @click="goToManageUser(scope.row.userId)">详情</el-button>
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
            :total="userList.length">
            </el-pagination>
        </div>
    </el-card>

    <!-- 菜品销售榜 -->
    <el-card class="box-card">
        <!-- 标题 -->
        <p class="info">菜品销售榜</p>

        <!-- 分栏 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 搜索框 -->
                <el-input class="search"
                 placeholder="请输入菜品姓名或编号"
                 v-model="queryInfo2.query"
                 clearable @clear="getResult2" @change="getResult2">
                <template #append>
                    <el-button @click="getResult2">搜索</el-button>
                </template>
                </el-input>

            </el-col>
        </el-row>
        <!-- 列表区域 -->
        <transition>
            <el-table
            :data="foodList.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)"
            v-model="foodList"
            style="width: 100%"
            stripe
            :default-sort = "{prop: 'date', order: 'descending'}">

                <el-table-column
                prop="sales"
                label="菜品销量"
                sortable
                width="120">
                </el-table-column>

                <el-table-column
                prop="foodId"
                label="菜品编号"
                sortable
                width="120">
                </el-table-column>

                <el-table-column
                prop="foodName"
                label="菜品名称"
                sortable
                width="120">
                </el-table-column>
                
                <el-table-column
                label="操作"
                width="240px">
                    <template v-slot="scope">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-button type="primary" @click="goToManageFood(scope.row.foodId)">详情</el-button>
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
            @size-change="handleSizeChange2" 
            @current-change="handleCurrentChange2" 
            :current-page="currentPage2" 
            :page-sizes="[1,5,10,20]" 
            :page-size="pageSize2" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="foodList.length">
            </el-pagination>
        </div>
    </el-card>

    </div>
</template>

 <style>
.total-div{
    display: flex;
}

.box-card{
    flex: 1;
    margin: 5px;
}

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

.search{
    width: 300px;
}

.info{
    color: rgb(48, 49, 51);
    font-weight: 700;
    font-size: large;
}
</style>

<script>
import axios from 'axios';

export default {
    el:"#manageorder",
    data(){
        return {
            // --------------------- 服务员列表 --------------------
            userList:[
                {
                    userId: 1,
                    username: '曾平',
                    sales: 13,
                }
            ],
            totalUserList:[
                {
                    userId: 1,
                    username: '曾平',
                    sales: 13,
                }
            ],
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
            // 筛选后的数据
            resultList:[],

            // --------------------- 菜品列表 --------------------- 
            foodList:[
                {
                    foodId: 1,
                    foodName: '宫保鸡丁',
                    sales: 10
                }
            ],
            totalFoodList:[
                {
                    foodId: 1,
                    foodName: '宫保鸡丁',
                    sales: 10
                }
            ],
            queryInfo2:{
                query:'', // 查询参数
                pagenum:1, // 当前页码
                pageSize:7 // 每页显示条数
            },
            // 获取订单列表的参数对象
            currentPage2:1,
            total2:null,
            pageSize2:7,
            // 筛选后的数据
            resultList2:[],
        }
    },
    created(){
        axios.get('/8081api/food/get_top3_food').then((res) => {
            this.foodList = res.data.data;
            this.totalFoodList = res.data.data;
        });
        axios.get('/8081api/user/get_top3_waiter').then((res) => {
            this.userList = res.data.data;
            this.totalUserList = res.data.data;
        });
    },
    methods:{
        // -------------------- 分页 ----------------------
        // 监听 page size 改变的事件 -- 服务员
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        // 监听页码值 改变的事件 -- 服务员
        handleCurrentChange (val) {
             console.log(`当前页: ${val}`);
            this.currentPage = val;
        },

        // 监听 page size 改变的事件 -- 菜品
        handleSizeChange2 (val) {
            console.log(`每页 ${val} 条`);
            this.currentPage2 = 1;
            this.pageSize2 = val;
        },
        // 监听页码值 改变的事件 -- 菜品
        handleCurrentChange2 (val) {
            console.log(`当前页: ${val}`);
            this.currentPage2 = val;
        },
        // --------------------- 跳转 ----------------------
        //跳转到菜品详细信息
        goToManageFood:function(id) {
            this.$router.push({
                path: "/food_detail",
                query: { id: id }
            })
        },
        //跳转到服务员详细信息
        goToManageUser:function(id) {
            this.$router.push({
                path: "/staff_detail",
                query: { id: id }
            })
        },
        // ---------------------  搜索框 ---------------------
        getResult: function () {

            let dataList = this.userList;
            let totalDataList = this.totalUserList;
            let query = this.queryInfo.query;

            // 处理空白
            if (query === '') {
                // dataList = totalDataList;
                this.userList = this.totalUserList;
                return;
            }

            let temp = [];
            for (let i = 0; i < totalDataList.length; i++) {
                if (query === (totalDataList[i].userId + "") ||
                    totalDataList[i].username.indexOf(query) !== -1) {
                    temp.push(totalDataList[i]);
                }
            }
            dataList = temp;
            
            // 渲染数据
            this.userList = dataList
        },

        getResult2: function(){
            let dataList = this.foodList;
            let totalDataList = this.totalFoodList;
            let query = this.queryInfo2.query;

            // 处理空白
            if (query === '') {
                // dataList = totalDataList;
                this.foodList = this.totalFoodList;
                return;
            }

            let temp = [];
            for (let i = 0; i < totalDataList.length; i++) {
                if (query === (totalDataList[i].foodId + "") ||
                    totalDataList[i].foodName.indexOf(query) !== -1) {
                    temp.push(totalDataList[i]);
                }
            }
            dataList = temp;
            
            // 渲染数据
            this.foodList = dataList
        }
    },

}
</script>