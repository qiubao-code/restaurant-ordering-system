<template>
    <div class="info" style="box-shadow: var(--el-box-shadow-base);">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
            <el-form-item label="通知标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="请输入消息的标题"></el-input>
            </el-form-item>

            <el-form-item label="订单编号" prop="value">
                <el-select filterable v-model="ruleForm.value" @change="changeHandler" placeholder="选择或搜索订单编号">
                    <el-option
                        v-for="item in orderIds"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="服务员编号" prop="value2">
                <el-select v-model="ruleForm.value2" filterable placeholder="选择或搜索服务员编号">
                    <el-option
                        v-for="item in waiterIds"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="消息内容" prop="content">
                <el-input v-model="ruleForm.content" type="textarea"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确认发布</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style>
 .info{
    width: 55%;
    margin: 30px auto;
    padding: 35px;
 }
</style>

<script>
    import axios from 'axios'
    import { ElMessage } from 'element-plus'


    export default {
        name: "Message",

        data () {
            return {
                ruleForm:{
                    title: '',
                    content: '',
                    value: '',
                    value2: ''
                },

                rules:{
                    title:[{
                        required: true,
                        message: '请输入消息标题',
                        trigger: 'blur',
                    }],
                    content:[{
                        required: true,
                        message: '请输入消息内容',
                        trigger: 'blur',
                    }],
                    value:[{
                        required: true,
                        message: '请指定订单编号',
                        trigger: 'blur',
                    }],
                    value2:[{
                        required: true,
                        message: '请指定通知的服务员',
                        trigger: 'blur',
                    }]
                },

                orderId: 1,
                waiterId: 1 + "",

                orderIds: [
                    {
                        value: 'orderId1',
                        label: 'orderId1',
                    },
                    {
                        value: 'orderId2',
                        label: 'orderId2',
                    },
                    {
                        value: 'orderId3',
                        label: 'orderId3',
                    },
                    {
                        value: 'orderId4',
                        label: 'orderId4',
                    },
                    {
                        value: 'orderId5',
                        label: 'orderId5',
                    },
                ],

                waiterIds: [
                    {
                        value: 'waiterId1',
                        label: 'waiterId1',
                    },
                    {
                        value: 'waiterId2',
                        label: 'waiterId2',
                    },
                    {
                        value: 'waiterId3',
                        label: 'waiterId3',
                    },
                    {
                        value: 'waiterId4',
                        label: 'waiterId4',
                    },
                    {
                        value: 'waiterId5',
                        label: 'waiterId5',
                    },
                ],
            }
        },

        methods: {
            changeHandler: function (val) {
                // console.log(val);
                axios.get('/8083api/back-kitchen/waiterId', {
                    params: {
                        user_id: val
                    }
                }).then((res) => {
                    // console.log(res.data);
                    this.ruleForm.value2 = res.data.data;
                });
            },

            //提交添加请求
            submitForm: function(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        ElMessage({
                            message: '填写信息不完整或错误',
                            type: 'error',
                        });
                        return false;
                    }else {
                        this.submitMessage();
                    }
                });
            },

            submitMessage: function () {
                let data = new FormData();
                data.append("title", this.ruleForm.title);
                data.append("content", this.ruleForm.content);
                // orderId 注意
                data.append("order_id", this.ruleForm.value);
                console.log(this.ruleForm.value2);
                data.append("create_time", new Date().getTime() + "");
                // TODO: send_user
                data.append("send_user", localStorage.getItem("userId"));
                data.append("receive_user", this.ruleForm.value2);
                // data.append("status", "0");

                axios.post('/8083api/back-kitchen/message', data).then((res) => {
                    // 添加成功
                    if(res.data.code === 1){
                        ElMessage({
                            message: '该消息已经成功发送',
                            type: 'success',
                        });
                        location.reload();
                    }
                    //添加失败
                    else{
                        ElMessage.error('对不起，消息发送失败');
                    }
                });
            }
        },

        created() {
            axios.get('/8083api/back-kitchen/orderIds').then((res) => {
                let orderIdsData = res.data.data.orderId;
                // console.log(orderIdsData);

                let orderIds = [];
                for (let i = 0; i < orderIdsData.length; i++) {
                    let orderId = {
                        value: orderIdsData[i],
                        label: orderIdsData[i]
                    };
                    orderIds.push(orderId);
                }
                this.orderIds = orderIds;
            });

            axios.get('/8083api/back-kitchen/waiterIds').then((res) => {
                let waiterIdsData = res.data.data.waiterIds;
                // console.log(orderIdsData);

                let waiterIds = [];
                for (let i = 0; i < waiterIdsData.length; i++) {
                    let waiterId = {
                        value: waiterIdsData[i],
                        label: waiterIdsData[i]
                    };
                    waiterIds.push(waiterId);
                }
                this.waiterIds = waiterIds;
            });
        }
    }
</script>

