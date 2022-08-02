<template>
    <div class="html" :style="{height:height}">
        <div class="body">
            <div id="loginDiv" class="animation-down">
                <el-form ref="form" :model="form">
                    <h1 style="text-align: center;color: aliceblue;">智能订餐系统</h1>
                    <p class="item">邮 &nbsp;箱<input class="input-item" id="userNname" type="text" v-model="formdata.id"><label id="name_trip"></label></p>
        
                    <p class="item">密 &nbsp;码<input class="input-item" id="password" type="password" v-model="formdata.pwd"><label id="password_trip"></label></p>
        
                    <div style="text-align: center;margin-top: 30px;">
                        <el-button class="button" @click="login">登录</el-button>
                        <!-- <el-button @click="reset" class="button">重置</el-button> -->
                    </div>

                    <!-- <div class="code" @click="refreshCode"></div>
                    <s-identify :identifyCode="identifyCode"></s-identify> -->
                </el-form>
            </div>
        </div>
    </div>

</template>

<style>
body{
    margin: 0;
}
</style>

<style scoped>
* {
    margin: 0;
    padding: 0;
}
        
.html {
    width: 100%;
    height: 650px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    background: url("./background.png") no-repeat 0px 0px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
}
    
.body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
    
#loginDiv {
    width: 37%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    background-color: rgba(75, 81, 95, 0.3);
    box-shadow: 7px 7px 17px rgba(52, 56, 66, 0.5);
    border-radius: 5px;
}
    
#name_trip {
    margin-left: 50px;
    color: red;
}
    
.item {
    margin-top: 30px;
    margin-left: 20px;
    color: azure;
}
    
.input-item {
    margin-left: 15px;
    border-radius: 5px;
    border-style: hidden;
    height: 30px;
    width: 140px;
    background-color: rgba(216, 191, 216, 0.5);
    outline: none;
    color: #f0edf3;
    padding-left: 10px;
}
    
.button {
    border-color: cornsilk;
    background-color: rgba(100, 149, 237, .7);
    color: aliceblue;
    border-style: hidden;
    border-radius: 5px;
    width: 100px;
    height: 31px;
    font-size: 16px;
}

.code {
    margin: 400px auto;
    width: 114px;
    height: 40px;
    border: 1px solid red;
}

/* ----------------- 动画 ----------------*/
@keyframes move-down {
    0%{
        transform: translateY(-300px);
    }
    50%{
        transform: translateY(-150px);
    }
    75%{
        transform: translateY(20px);
    }

    100%{
        transform: translateY(0px);
    }
}

.animation-down{
    animation: move-down 1s;
    animation-timing-function: ease-in;
}
</style>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import SIdentify from '../components/VerificationCode.vue'

export default {
    data(){
        return{
            checked: true,
            formdata:{
                id: '',
                pwd:''
            },
            height: 0,
            identifyCodes: "1234567890",
            identifyCode: ""
        }
    },
    mounted() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
    },
    methods:{

        login:function(){

            let data = new FormData();
            data.append("email", this.formdata.id);
            data.append("password", this.formdata.pwd);

            axios.post('/8081api/user/index',data).then((res)=>{
                console.log(res.data);
                let temp=res.data;
                console.log(temp);
                if(temp.code === -1){
                    if(temp.msg === "1"){
                        //no such a person
                        ElMessage({
                        message: '输入邮箱错误',
                        type: 'error'
                    });
                    }
                    else if(temp.msg === "2"){
                        //pwd not correct
                        ElMessage({
                            message: '密码错误',
                            type: 'error'
                        });
                    }
                }else{
                    //input->status
                    // window.location.href = '/';
                    ElMessage({
                        message: '登录成功',
                        type: 'success'
                    });
                    // let role = temp.data.role;

                    localStorage.setItem("userId", temp.data.userId);
                    localStorage.setItem("userRole", temp.data.role);
                    localStorage.setItem("username", temp.data.username);
                    localStorage.setItem("portrait", "http://" + temp.data.portrait);
                    // console.log(temp.data);

                    // console.log(rederict);
                    // window.location.href = "http://47.108.225.54/#"+ rederict;
                    window.location.href = "/#/the_staff_detail";
                }
            });
        },

        reset: function(){
            this.data.formdata.id = "";
            this.data.formdata.pwd = ""
        },

        //验证码生成
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },
        refreshCode() {
            this.identifyCode = "";
            this.makeCode(this.identifyCodes, 4);
        },
        makeCode(o, l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += this.identifyCodes[
                this.randomNum(0, this.identifyCodes.length)
                ];
            }
            console.log(this.identifyCode);
        }
    },
    
    created () {
        window.addEventListener('resize', this.GetWindowInfo); //注册监听器
	    this.height = window.innerHeight+"px"; // 高

        // 清理浏览器本地缓存, 用户身份失效
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        // console.log(localStorage.getItem("userId"));
    }
}
</script>