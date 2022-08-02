// 修改基本完成功能
<template>
<el-container>
      <el-main>
            <p class="my-info">我的个人信息</p>
            <el-form
            ref="staffdata" :model="staffdata"
            :rules="rules"
            label-width="120px"
            class="form" status-icon>
                <div class="total-div animation-left" style="box-shadow: var(--el-box-shadow-base);">
                    <div class="img-div">
                        <img :src="staffdata.portrait" class="avatar" />
                        <!-- <el-button size="small" plain type="primary" style="margin:15px">点击修改头像</el-button> -->
                    </div>

                    <div class="text-div">
                        <el-form-item label="我的姓名" prop="username" >
                            <el-input readonly v-model="staffdata.username"></el-input>
                        </el-form-item>
                        <el-form-item label="我的职位" prop="role" aria-readonly="true">
                            <el-input readonly v-model="staffdata.role"></el-input>
                        </el-form-item>
                        <el-form-item label="我的工资" prop="salary">
                            <el-input readonly v-model="staffdata.salary"></el-input>
                        </el-form-item>
                        <el-form-item label="我的奖金" prop="bonus">
                            <el-input readonly v-model="staffdata.bonus"></el-input>
                        </el-form-item>
                        <el-form-item label="我的密码" prop="password">
                            <el-input type="password" v-model="staffdata.password"></el-input>
                        </el-form-item>
                        <el-form-item label="密码确认" prop="checkPassword">
                            <el-input type="password" v-model="staffdata.checkPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="我的电话" prop="phone">
                            <el-input v-model="staffdata.phone"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('staffdata')">确认修改</el-button>
                            <!-- <el-button >取消</el-button> -->
                        </el-form-item>
                    </div>
                </div>

            </el-form>
        
      </el-main>
    </el-container>
</template>

<script>
import { getRoleStr } from './admin/staff/UserInfo';
import axios from 'axios';
import { ElMessageBox, ElMessage } from 'element-plus';

    export default {
        name:'staffdetail',
        data(){
            return{
                ruleForm: {
                    
                },
                staffdata:{
                    name: '',
                    role: '',
                    price: '',
                    bonus: '',
                    phone: '',
                    password: '',
                    checkPassword: ''
                },
                dialogVisible : false,
                rules:{ //表单校验规则
                    phone: [
                        {
                            // type: 'text',
                            required: true,
                            message: '请录入员工手机号码',
                            trigger: 'blur',
                        },
                        {
                            min:11, max:11,
                            message: '手机号码为11位',
                            trigger: 'change',
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请设置员工密码',
                            trigger: 'blur',
                        },
                        {
                            min:8,
                            max:24,
                            message: '密码字符为8-24位',
                            trigger: 'change',
                        }
                    ],
                    checkPassword: [
                        {
                            required: true,
                            // message: '两次输入的密码必须相同',
                            validator: this.checkPwd,
                            trigger: 'change',
                        }
                    ]
                }
            }
        },
        created(){
            // 获取某个员工的详细信息接口
            console.log(localStorage.getItem("userId"));
            axios.get('/8081api/user/user_info',{params: {id:localStorage.getItem("userId")}}).then((res)=>{
            
                let staffdata = res.data.data;
                staffdata.portrait ="http://"+(staffdata.portrait)
                staffdata.checkPassword = staffdata.password
                staffdata.role = getRoleStr(staffdata.role)

                //渲染数据
                this.staffdata = staffdata
                }).catch((err)=>{
                    console.log(err)
                })
        },
        methods:{
            //取消修改
            cancel:function(){
                this.dialogVisible = false
            },
            //两次输入相同密码
            checkPwd: function(rule, value, callback){
                if(this.staffdata.checkPassword === this.staffdata.password){
                    callback();
                }else{
                    return new Error('两次需要输入相同的密码');
                }
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
                        this.change()
                    }
                });
            },

            //修改员工信息
            change:function(){
                let data = new FormData();
                let staffdata = this.staffdata;

                data.append("userId", staffdata.userId);
                data.append("password", staffdata.password);
                data.append("username", staffdata.username);
                data.append("phone", staffdata.phone);

                axios.post('/8081api/user/edit', data).then((res) => {
                    console.log(res.data);
                    let temp = res.data;
                    if(temp.code === 1){

                        ElMessage({
                            type: 'success',
                            message: '修改成功',
                        });
                    }else{
                        ElMessage({
                            type: 'error',
                            message: '修改失败',
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            //删除数据
            delData:function(){
            // 弹出框
            ElMessageBox.confirm(
                '是否确认注销',
                '注意',{
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                let data = new FormData();

                console.log('注销:',this.staffdata)

                data.append("id", this.staffdata.userId);                

                axios.post('/8081api/user/delete', data).then((res)=>{
                    
                    if(res.data.code == 1){
                        ElMessage({
                            type: 'success',
                            message: '注销成功',
                        });
                        window.location.href = "/#/"
                    }else{
                        console.log(res.data.msg);
                        ElMessage({
                            type: 'error',
                            message: '注销失败',
                        });

                    }
                }) 
            })
            },
        }
    }
</script>

<style scoped>
.demo-basic {
  text-align: center;
}
.demo-basic .sub-title {
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.demo-basic .demo-basic--circle,
.demo-basic .demo-basic--square {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.demo-basic .block:not(:last-child) {
  border-right: 1px solid var(--el-border-color-base);
}
.demo-basic .block {
  flex: 1;
}
.demo-basic .el-col:not(:last-child) {
  border-right: 1px solid var(--el-border-color-base);
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.body{
    /* align-items: center; */
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: auto;
}
.flex-item{
    margin: 20px;
}
.demo-ruleForm .el-input{
    width: 200px;
}
/* --------------------------------------添加---------------------------- */
.total-div{
    display: flex; 
    flex-direction: row;
    text-align: center;
    justify-items: center;
    width: 80%;
    padding: 60px 30px 20px 50px;
    background-color: white;
}
.text-div{
    display: flex; 
    /* flex: 1; */
    flex-direction: column
}
.img-div{
    /* flex: 1; */
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.my-info{
    color: rgb(48, 49, 51);
    font-weight: 700;
    font-size: large;
}

@keyframes move-left {
    0%{
        transform: translateX(100px);
    }
    100%{
        transform: translateX(0px);
    }
}

.animation-left{
    animation: move-left 0.5s;
    animation-timing-function: ease-in;
}
</style>
