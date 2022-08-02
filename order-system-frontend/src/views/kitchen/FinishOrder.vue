<template>
    <div class="table-info">
        <el-table :data="tableData" stripe border style="box-shadow: var(--el-box-shadow-base);">
            <el-table-column prop="id" label="订单编号" width="150"/>

            <el-table-column prop="tableId" label="桌号" width="150" />

            <el-table-column prop="totalPrice" label="总价格" width="150" />

            <el-table-column prop="numPeople" label="用餐人数" width="150" />

            <el-table-column label="详情">
                <template #default="scope">
                    <el-button type="primary" plain size="small" @click="checkDetail(scope.$index)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style scoped>
    .table-info{
        font-size: 20px;
        width: 70%;
        margin: 30px auto;
        padding: 35px;
    }
</style>

<script>
    import axios from 'axios';

    export default {
        name: "Notice",

        data () {
            return {
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
            }
        },

        methods: {
            checkDetail: function (index) {
                var id = this.tableData[index].id;
                console.log(id);
                this.$router.push({
                    path: "/kitchen/order_detail2",
                    query: { id: id }
                });
            }
        },

        created() {
            let data = new FormData();
            axios.get('/8083api/back-kitchen/finished').then((res) => {
                let orders = res.data.data;
                console.log(orders);
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
            });
        }
    }
</script>