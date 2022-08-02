<template>
    <div class="table-info">
<!--        <el-table :data="tableData" stripe border style="box-shadow: var(&#45;&#45;el-box-shadow-base);">-->
        <el-table :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)" stripe border style="box-shadow: var(--el-box-shadow-base);">
            <el-table-column prop="id" label="订单编号" width="150"/>

            <el-table-column prop="tableId" label="桌号" width="150" />

            <el-table-column prop="totalPrice" label="总价格" width="150" />

            <el-table-column prop="numPeople" label="用餐人数" width="150" />

            <el-table-column label="详情">
                <template #default="scope">
                    <el-button type="primary" plain size="small" @click="checkDetail(scope.$index + (query.pageIndex-1)*query.pageSize)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                           :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange">
            </el-pagination>
        </div>
    </div>
</template>

<style scoped>
    .table-info{
        font-size: 20px;
        width: 70%;
        margin: 30px auto;
        padding: 35px;
    }

    .pagination {
        margin: 20px 0;
        text-align: right;
    }
</style>

<script>
    import axios from 'axios';
    import GoEasy from "goeasy";

    export default {
        name: "Notice",

        data () {
            return {
                // 分页
                query: {
                    pageIndex: 1,
                    pageSize: 8
                },
                pageTotal: 1,

                tableData: [
                    {
                        "id": 1,
                        "tableId": 56,
                        "totalPrice": 62,
                        "numPeople": 88
                    },
                    {
                        "id": 2,
                        "tableId": 56,
                        "totalPrice": 62,
                        "numPeople": 88
                    },
                    {
                        "id": 3,
                        "tableId": 56,
                        "totalPrice": 62,
                        "numPeople": 88
                    }
                ],

                goeasy: null
            }
        },

        methods: {
            checkDetail: function (index) {
                let id = this.tableData[index].id;
                console.log(id);
                this.$router.push({
                    path: "/kitchen/order_detail1",
                    query: { id: id }
                });
            },

            // 分页
            handlePageChange: function (currentPage) {
                this.query.pageIndex = currentPage;
                // this.getData();
                console.log(currentPage);
            },
        },

        created() {
            // let data = new FormData();
            axios.get('/8083api/back-kitchen/unfinished').then((res) => {
                let orders = res.data.data;
                // console.log(res.data);
                let tableData = [];
                for (let i = 0; i < orders.length; i++) {
                    let item = {
                        id: orders[i].orderId,
                        tableId: orders[i].tableId,
                        totalPrice: orders[i].totalPrice,
                        numPeople: orders[i].numPeople
                    };
                    tableData.push(item);
                }
                this.tableData = tableData;

                // 分页
                this.pageTotal = this.tableData.length || this.query.pageSize;
            });

            // 建立长连接
            // 创建连接
            this.goeasy = GoEasy.getInstance({
                host:"hangzhou.goeasy.io",
                appkey:"BC-39a32d080309433cad62d463a4eea5a0",
                modules:['pubsub']//根据需要，传入‘pubsub’或'im’，或数组方式同时传入
            });

            //建立连接
            this.goeasy.connect({
                id:"001", //pubsub选填，im必填，最大长度60字符
                data:{"avatar":"/www/xxx.png","nickname":"Neo"}, //必须是一个对象，pubsub选填，im必填，最大长度300字符，用于上下线提醒和查询在线用户列表时，扩展更多的属性
                onSuccess: function () {  //连接成功
                    console.log("GoEasy connect successfully.") //连接成功
                },
                onFailed: function (error) { //连接失败
                    console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
                },
                onProgress:function(attempts) { //连接或自动重连中
                    console.log("GoEasy is connecting", attempts);
                }
            });

            // 接收消息
            let pubsub = this.goeasy.pubsub;
            let that = this;
            // console.log(localStorage.getItem("userId"));
            pubsub.subscribe({
                channel: 'back-kitchen',
                onMessage: function (message) {
                    console.log("Channel:" + message.channel + " content:" + message.content);

                    // 数据处理
                    let data = JSON.parse(message.content);
                    let item = {
                        id: data.orderId,
                        tableId: data.tableId,
                        totalPrice: data.totalPrice,
                        numPeople: data.numPeople
                    };
                    that.tableData.push(item);
                },
                onSuccess: function () {
                    console.log("Channel订阅成功。");
                },
                onFailed: function (error) {
                    console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
                }
            });
        }
    }
</script>