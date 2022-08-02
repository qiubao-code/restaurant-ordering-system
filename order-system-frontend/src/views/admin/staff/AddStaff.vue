// 修改基本完成功能

<template>
    <el-container>
      <el-main>
            <p class="my-info">添加员工</p>
            <el-form
            ref="ruleForm" :model="ruleForm"
            :rules="rules"
            label-width="120px"
            class="form"
            status-icon>
                <div class="total-div" style="box-shadow: var(--el-box-shadow-base);">
                    <div class="img-div">
                        <el-upload action=""
                            class="avatar-uploader"
                            :limit=1
                            :auto-upload=false
                            :on-change="fileOnchange"
                            :on-remove="handleRemove"
                            :on-success="handleAvatarSuccess"
                            :file-list="fileList"
                            :show-file-list="true"
                            :before-upload="beforeAvatarUpload"
                            list-type="picture">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
                        <el-button size="small" plain type="primary" style="margin:15px">点击修改员工照片</el-button>
                        </el-upload>
                    </div>

                    <div class="text-div">
                        <el-form-item label="员工邮箱" prop="email" >
                            <el-input v-model="ruleForm.email" placeholder="请输入员工邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="员工姓名" prop="username" >
                            <el-input v-model="ruleForm.username" placeholder="请输入员工姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="员工职位" prop="role" >
                            <el-select v-model="ruleForm.role" style="width:200px" placeholder="请选择员工职位">
                                <el-option label="管理员" value="1"></el-option>
                                <el-option label="服务员" value="2"></el-option>
                                <el-option label="后厨人员" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="员工工资" prop="salary" >
                            <el-input-number v-model="ruleForm.salary" :precision="2" :step="100"/>
                        </el-form-item>
                        <el-form-item label="员工奖金" prop="bonus">
                            <el-input-number v-model="ruleForm.bonus" :precision="2" :step="100"/>
                        </el-form-item>
                        <el-form-item label="员工密码" prop="password">
                            <el-input type="password" placeholder="设置员工密码"  v-model="ruleForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="密码确认" prop="checkPassword">
                            <el-input type="password" placeholder="再次输入员工密码"  v-model="ruleForm.checkPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="员工电话" prop="phone">
                            <el-input placeholder="员工联系电话"  v-model="ruleForm.phone"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">确认添加</el-button>
                            <!-- <el-button type="primary" @click="addUser()">确认添加</el-button> -->
                            <!-- <el-button >取消</el-button> -->
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        
      </el-main>
    </el-container>
</template>

<style scoped>
.total-div{
    display: flex; 
    flex-direction: row;
    text-align: center;
    justify-items: center;
    width: 80%;
    padding: 60px 30px 20px 50px;
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
.el-icon .avatar-uploader-icon {
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

<script>
    import axios from 'axios';
    import { ElMessage } from "element-plus";
    
    export default {
        name:"",
        // components:{reactive},
        data(){
          return{
            fileList: [], //上传头像文件
            param2: new FormData(), //提交的表单
            ruleForm: { //表单字段对象
              username: '',
              role: '',
              price: '',
              bonus: '',
              phone: '',
              email: '',
              password: '',
              checkPassword: ''
            },
            imageUrl: "http://47.108.225.54:9090/img/user.png", //默认头像
            rules:{ //表单校验规则
                username: [
                    {
                        required: true,
                        message: '请输入员工姓名',
                        trigger: 'blur',
                    },
                    {
                        trigger: 'blur',
                        validator: this.checkName
                    },
                    {
                        min: 2,
                        max: 10,
                        message: '员工姓名长度为 2- 10'
                    }
                ],
                role: [
                    {
                        required: true,
                        message: '请设置员工身份',
                        trigger: 'blur',
                    },
                ],
                salary: [
                    {
                        required: true,
                        message: '请输入员工工资',
                        trigger: 'blur',
                    }
                ],
                bonus: [
                    {
                        required: true,
                        message: '请输入员工奖金',
                        trigger: 'blur',
                    }
                ],
                phone: [
                    {
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
                        validator: this.checkPwd,
                        trigger: 'change',
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '请输入员工邮箱',
                        trigger: 'blur',
                    },
                    {
                        validator: this.checkEmail,
                        trigger: 'change'
                    }
                ],
            },
            //是否上传自己的头像
            setImg: false
          }
        },
        methods:{

            //校验两次输入相同密码
            checkPwd: function(rule, value, callback) {
                if(this.ruleForm.checkPassword === this.ruleForm.password){
                    callback();
                }else{
                    return new Error('两次需要输入相同的密码');
                }
            },

            //校验邮箱
            checkEmail: function(rule, value, callback){
                let re = /^\w+@[a-z0-9]+\.[a-z]+$/i;
                if (re.test(this.ruleForm.email)){
                    callback()
                }
                else{
                    callback(new Error('输入的邮箱格式有误'))
                }
            },

            //校验输入是否存在数字
            checkName: function(rule, value, callback) {
                var reg=/\d/;
                if (reg.test(this.ruleForm.username)){
                    callback(new Error('员工姓名不能存在数字'))
                }
                else{
                    callback()
                }
            },

            //上传头像校验 [TODO]
            beforeAvatarUpload: function(file) {
                let isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                let isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    ElMessage.error('Avatar picture must be JPG format!')
                }
                if (!isLt2M) {
                    ElMessage.error('Avatar picture size can not exceed 2MB!')
                }
                return isJPG && isLt2M
            },

            //回显头像[TODO]
            handleAvatarSuccess: function(response, file, fileList) {
                this.imageUrl = URL.createObjectURL(file)
                console.log(this.imageUrl)
            },

            //提交添加请求
            submitForm: function(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        ElMessage({
                            message: '填写信息不完整或错误,或邮箱已被注册',
                            type: 'error',
                        });
                        return false;
                    }else {
                        this.addUser();
                    }
                });
            },

            addUser: function(){
                // 如果使用默认头像
                if(!this.setImg){
                    this.param2.append("portrait", '47.108.225.54:9090/img/user.png');
                }
                this.param2.append("username", this.ruleForm.username);
                this.param2.append("role", this.ruleForm.role);
                this.param2.append("salary", this.ruleForm.salary);
                this.param2.append("bonus", this.ruleForm.bonus);
                this.param2.append("phone", this.ruleForm.phone);
                this.param2.append("password", this.ruleForm.password);
                this.param2.append("email", this.ruleForm.email);

                // console.log(item);
                axios.post('/8081api/user/add', this.param2).then((res) => {
                    // console.log(res.data);
                    let temp = res.data;
                    console.log(temp);
                    if(temp.code === 1){
                        
                        ElMessage({
                            message: '添加成功,新增员工ID:'+temp.data.userId,
                            type: 'success'
                        });
                        this.$router.push({
                            path: "/staff_detail",
                            query: { id: temp.data.userId }
                        });

                    } else {
                        ElMessage({
                            message: '添加失败',
                            type: 'warning'
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                });

                // push到员工详情    
                // this.addstafflist.push(item);

                // 清空文本框
                this.ruleForm.username='';
                this.ruleForm.role='';
                this.ruleForm.salary=0;
                this.ruleForm.bonus=0;
            },

            fileOnchange: function (file,filesList){
                // this.param2 = new FormData();
                this.param2.append('file', file.raw, file.name);
                this.setImg = true
            },

            handleRemove(file,filesList) {
                this.param2.delete('file');
                this.setImg = false
            },
        }
    }
</script>