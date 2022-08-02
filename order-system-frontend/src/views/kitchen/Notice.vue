<template>
    <div class="table-info">
        <el-table :default-sort="{prop: 'date', order: 'descending'}" :data="tableData" stripe border style="box-shadow: var(--el-box-shadow-base);">
            <el-table-column label="时间" prop="date" width="250" sortable="">
                <template #default="scope">
                    <el-icon><clock /></el-icon>
                    <span style="margin-left: 10px">{{scope.row.date}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="title" label="公告标题" width="300">
            </el-table-column>>

            <el-table-column label="标记" >
                <template #default="scope">
                    <el-button v-if="tableData[scope.$index].status" size="small">已读 </el-button>
                    <el-button v-else type="primary" size="small" @click="setRead(scope.$index)">标为已读</el-button>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="详情">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="checkDetail(scope.$index)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style scoped>
    .table-info{
        font-size: 20px;
        width: 80%;
        margin: 30px auto;
        padding: 35px;
    }
</style>

<script>
    import axios from 'axios';
    import { ElMessageBox, ElMessage, ElNotification} from 'element-plus';
    import { h } from 'vue';
    import { Clock } from '@element-plus/icons-vue';

    export default {
        name: "Notice",

        components: {
            Clock
        },

        data () {
            return {
                tableData: [
                    {
                        id: 1,
                        title: '公告1',
                        detail: '公告1详情',
                        status: false,
                        date: ''
                    },
                    {
                        id: 2,
                        title: '公告2',
                        detail: '公告2详情',
                        status: true,
                        date: ''
                    },
                    {
                        id: 3,
                        title: '公告3',
                        detail: '公告3详情',
                        status: false,
                        date: ''
                    },
                    {
                        id: 4,
                        title: '公告4',
                        detail: '公告4详情',
                        status: true,
                        date: ''
                    },
                ],

                // 弹出框
                noticeData: [],

                dialogVisible: false
            }
        },

        methods: {
            setRead: function (index) {
                this.tableData[index].status = 1;
                let noticeId = this.tableData[index].id;

                let data = new FormData();
                data.append("user_id", localStorage.getItem("userId"));
                data.append("notice_id", noticeId);

                axios.post('/8083api/back-kitchen/notice/read', data).then((res) => {
                    console.log(res);

                    // 标为已读
                    ElMessage({
                        message: '已读成功',
                        type: 'success',
                    })
                });
            },
            checkDetail: function (index) {
                console.log(this.tableData[index].detail);
                this.dialogVisible = !this.dialogVisible;
                let info = this.tableData[index].detail;
                ElMessageBox({
                    title: '消息详情',
                    message: h('p', null, [
                        h('span', null, info),
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = 'Loading...';
                        setTimeout(() => {
                            done();
                            setTimeout(() => {
                                instance.confirmButtonLoading = false
                            }, 300)
                        }, 1000)
                    } else {
                        done()
                    }
                    },
                }).then((action) => {
                    ElMessage({
                        type: 'success',
                        // message: `action: ${action}`,
                        message: '标为已读'
                    });
                    this.setRead(index)
                })
            },

            /**
             * 日期排序
             */
            dateSort: function (a, b) {
                return Date.parse(b.date) - Date.parse(a.date);
            }
        },

        created() {
            let data = new FormData();
            data.append("user_id", localStorage.getItem("userId"));
            axios.get('/8083api/back-kitchen/notice', {
                params: {
                    "user_id": localStorage.getItem("userId")
                }
            }).then((res) => {
                let notices = res.data.data.notices;
                console.log(res.data);
                let tableData = [];
                let noticeData = [];    // 弹出框
                for (let i = 0; i < notices.length; i++) {
                    let item = {
                        id: notices[i].noticeId,
                        title: notices[i].title,
                        detail: notices[i].content,
                        status: notices[i].status,
                        date: notices[i].createTimeStr
                    };
                    if (notices[i].status === 0) {
                        noticeData.push(item);
                    }
                    tableData.push(item);
                }
                tableData.sort(this.dateSort);
                noticeData.sort(this.dateSort);
                this.tableData = tableData;
                this.noticeData = noticeData;

                // 弹出框
                for (let i = 0; i < this.noticeData.length; i++) {
                    setTimeout(() => {
                        ElNotification ({
                            title: '公告标题',
                            message: this.noticeData[i].title,
                            type: 'warning',
                            duration: 8000
                        });
                    }, 1000);
                    // ElNotification ({
                    //     title: '公告',
                    //     message: this.noticeData[i].title,
                    //     type: 'warning',
                    //     duration: 8000
                    // });
                }
            });
        }
    }
</script>