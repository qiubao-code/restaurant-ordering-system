<template>
    <div class="info animation-down" style="box-shadow: var(--el-box-shadow-base);">
        <p1>发布公告</p1>

        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="通知标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入消息的标题"></el-input>
            </el-form-item>

            <el-form-item label="消息内容" prop="content">
                <el-input v-model="form.content" type="textarea"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">确认发布</el-button>
                <!-- <el-button>取消</el-button> -->
            </el-form-item>
        </el-form>
    </div>
</template>

<style>
.info{
    width: 55%;
    margin: 10px auto;
    padding: 35px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    /* background-color: white; */
    /* background-image: linear-gradient( #f4f4f5,  #0000); */
    /* background-image: linear-gradient(rgb(235, 241, 246), #FFFFFF 40%, rgb(235, 241, 246)); */
}
p1{
    color: rgb(92, 93, 95);
    font-weight: 700;
    font-size: 19px;
    margin: 20px auto;
}
.el-form{
    width: 90%;
}
@keyframes move-down {
    0%{
        transform: translateY(-300px);
    }
    50%{
        transform: translateY(-150px);
    }
    100%{
        transform: translateY(0px);
    }
}

.animation-down{
    animation: move-down 0.2s;
    animation-timing-function: linear;
}
</style>

<script>
    import axios from 'axios'
    import { ElMessage } from 'element-plus'


    export default {
        name: "Message",

        data () {
            return {
                form: {
                    title: '',
                    content: ''
                },
                rules: {
                    title: [
                        {
                            required: true,
                            message: '请输入公告标题',
                            trigger: 'blur',
                        }
                    ],
                    content: [
                        {
                            required: true,
                            message: '请输入公告正文',
                            trigger: 'blur',
                        }
                    ],
                }
            }
        },

        methods: {
            //提交添加请求
            submitForm: function(formName){
                //校验表单

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

            // 添加公告
            submitMessage: function () {
                let data = new FormData();
                
                data.append("title", this.form.title);
                data.append("content", this.form.content);
                
                axios.post('/8081api/admin/notice', data).then((res) => {
                    // 添加成功
                    if(res.data.code === 1){
                        ElMessage({
                            message: '公告发送成功',
                            type: 'success',
                        });
                        location.reload();
                    }
                    //添加失败
                    else{
                        ElMessage.error('公告发送失败');
                    }
                });
            }
        },

        created() {
           
        }
    }
</script>

