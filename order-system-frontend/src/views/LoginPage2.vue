<template>
    <el-card class="login-form-layout">
        <el-form>
            <div style="font-size: 70px; text-align: center;">
<!--                <el-icon><shop style="color: #409EFF" /></el-icon>-->
                <img style="width: 120px" src="../assets/logo.png"/>
            </div>
            <h2 class="login-title" style="color: #409EFF; margin-bottom: 40px">饱了么-智能订餐系统</h2>
            <el-form-item prop="username">
                <el-input placeholder="请输入用户名"
                          name="username"
                          type="text"
                          v-model="formdata.id"
                          autocomplete="on">
                    <template #prepend>
                        <el-icon><user-filled style="color: #409EFF" /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input placeholder="请输入密码"
                          name="password"
                          :type="passwordType"
                          v-model="formdata.pwd"
                          autocomplete="on"
                          @keyup.enter="submitForm"
                          style="margin-top: 10px">
                    <template #prepend>
                        <el-icon><lock style="color: #409EFF" /></el-icon>
                    </template>
                    <template #append>
                        <img v-bind:src="url"
                             alt="eye"
                             style="width: 18px; height: 18px; margin-top: 10px"
                             @click="eyeClick">
                    </template>
                </el-input>
            </el-form-item>
<!--            <el-checkbox v-model="checked">记住密码</el-checkbox>-->
            <el-form-item style="margin-bottom: 30px;text-align: center;margin-top: 30px">
                <el-button type="primary"
                           style="width: 45%; margin: 0 auto"
                           @click="submitForm"
                           :loading="loginLoading">登录</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <img src="../assets/images/login_center_bg.png" class="login-center-layout" alt="bg">

    <!-- 人脸识别 -->
    <el-dialog
            title="拍照上传"
            v-model="visible"
            @close="onCancel"
            width="1065px"
            :center="true" top="40px">
        <template v-slot:title>
            <el-icon style="font-size: 70px;"><camera-filled style="color: #409EFF" /></el-icon>
            <div style="color: #409EFF; font-weight: bold">拍照上传</div>
        </template>
        <div class="box">
            <article class="border-panel">
                <video
                        id="videoCamera"
                        class="canvas"
                        :width="videoWidth"
                        :height="videoHeight"
                        autoPlay>
                </video>
            </article>
            <article class="border-panel">
                <canvas
                        id="canvasCamera"
                        class="canvas"
                        :width="videoWidth"
                        :height="videoHeight">
                </canvas>
            </article>
        </div>
        <template v-slot:footer>
            <el-button
                    @click="drawImage"
                    size="medium"
                    type="primary"
                    round>
                <el-icon><camera /></el-icon> &nbsp; 拍照
            </el-button>
            <el-button
                    v-if="open"
                    @click="getCompetence"
                    size="medium"
                    type="primary"
                    round>
                <el-icon><check /></el-icon> &nbsp; 打开摄像头
            </el-button>
            <el-button
                    v-else
                    @click="stopNavigator"
                    size="medium"
                    type="primary"
                    round>
                <el-icon><close-bold /></el-icon> &nbsp; 关闭摄像头
            </el-button>
            <el-button
                    @click="resetCanvas"
                    size="medium"
                    type="info"
                    round>
                <el-icon><refresh-right /></el-icon> &nbsp; 重置
            </el-button>
            <el-button
                    @click="onCancel"
                    size="medium"
                    type="danger"
                    round>
                <el-icon><circle-close-filled /></el-icon> &nbsp; 取消
            </el-button>
            <el-button
                    @click="onUpload"
                    :loading="loading"
                    type="primary"
                    size="medium"
                    round>
                <el-icon><upload /></el-icon> &nbsp; 上传
            </el-button>
        </template>
    </el-dialog>
</template>

<script>
    import axios from 'axios';
    import { ElMessage } from 'element-plus';
    import { Shop, UserFilled, Lock, CameraFilled, Camera, CloseBold, Check, RefreshRight,
        CircleCloseFilled, Upload } from '@element-plus/icons-vue';

    export default {
        name: "Login",

        components: {
            Shop,
            UserFilled,
            Lock,
            CameraFilled,
            Camera,
            CloseBold,
            Check,
            RefreshRight,
            CircleCloseFilled,
            Upload,
        },

        data() {
            return {
                formdata: {
                    id: '',
                    pwd: ''
                },
                passwordType: 'password',
                url: require('../assets/images/eye-close.png'),
                loginLoading: false,
                // checked: false,
                value: '',

                // 人脸识别
                visible: false,
                thisVideo: null,
                videoWidth: 500,
                videoHeight: 400,
                thisContext: null,
                thisCancas: null,
                open: false,
                loading: false,
            }
        },
        methods: {
            submitForm() {
                let data = new FormData();
                data.append("email", this.formdata.id);
                data.append("password", this.formdata.pwd);

                axios.post('/8081api/user/index',data).then((res)=>{
                    // console.log(res.data);
                    let temp=res.data;
                    // console.log(temp);
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
                    } else {
                        // TODO: 若为管理员, 则进行身份校验
                        // console.log(temp.data.role);
                        if (temp.data.role === 1) {
                            this.visible = true;
                            // 设置 tempUserId
                            // 设置 temp 缓存
                            localStorage.setItem("tempUserId", temp.data.userId);
                            localStorage.setItem("tempUserRole", temp.data.role);
                            localStorage.setItem("tempUsername", temp.data.username);
                            localStorage.setItem("tempPortrait", "http://" + temp.data.portrait);
                            this.getCompetence();
                        } else {    // 不为管理员, 直接登录
                            ElMessage({
                                message: '登录成功',
                                type: 'success'
                            });
                            localStorage.setItem("userId", temp.data.userId);
                            localStorage.setItem("userRole", temp.data.role);
                            localStorage.setItem("username", temp.data.username);
                            localStorage.setItem("portrait", "http://" + temp.data.portrait);
                            window.location.href = "/#/the_staff_detail";
                        }
                    }
                });
            },
            eyeClick() {
                if (this.passwordType === 'password') {
                    this.passwordType = 'text';
                } else {
                    this.passwordType = 'password';
                }

                if (this.url === require("../assets/images/eye-close.png")) {
                    this.url = require("../assets/images/eye-open.png");
                } else {
                    this.url = require("../assets/images/eye-close.png");
                }
            },

            onCancel() {
                this.visible = false;
                this.resetCanvas();
                this.stopNavigator();
            },
            //重置画布
            resetCanvas() {
                this.imgSrc = "";
                this.clearCanvas('canvasCamera');
            },
            //关闭摄像头
            stopNavigator() {
                if (this.thisVideo) {
                    this.thisVideo.srcObject.getTracks()[0].stop();
                    this.open = true;       //切换成打开摄像头
                }
            },
            //清空画布
            clearCanvas(id) {
                let c = document.getElementById(id);
                let cxt = c.getContext("2d");
                cxt.clearRect(0, 0, c.width, c.height);
            },
            //绘制图片
            drawImage() {
                if (!this.open) {
                    // 点击canvas画图
                    this.thisContext.drawImage(this.thisVideo, 0, 0, this.videoWidth, this.videoHeight);
                    // 获取图片base64链接
                    this.imgSrc = this.thisCancas.toDataURL('image/png');
                } else {
                    ElMessage.error("摄像头未开启");
                }
            },
            // 调用摄像头权限
            getCompetence() {
                //必须在model中render后才可获取到dom节点,直接获取无法获取到model中的dom节点
                this.$nextTick(() => {
                    const _this = this;
                    this.open = false;      //切换成关闭摄像头
                    this.thisCancas = document.getElementById('canvasCamera');
                    this.thisContext = this.thisCancas.getContext('2d');
                    this.thisVideo = document.getElementById('videoCamera');
                    // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
                    if (navigator.mediaDevices === undefined) {
                        navigator.mediaDevices = {}
                    }
                    // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
                    // 使用getUserMedia，因为它会覆盖现有的属性
                    // 这里，如果缺少getUserMedia属性，就添加它
                    if (navigator.mediaDevices.getUserMedia === undefined) {
                        navigator.mediaDevices.getUserMedia = function (constraints) {
                            // 首先获取现存的getUserMedia(如果存在)
                            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;
                            // 有些浏览器不支持，会返回错误信息
                            // 保持接口一致
                            if (!getUserMedia) {
                                return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
                            }
                            // 否则, 使用Promise将调用包装到旧的navigator.getUserMedia
                            return new Promise(function (resolve, reject) {
                                getUserMedia.call(navigator, constraints, resolve, reject)
                            })
                        }
                    }
                    const constraints = {
                        audio: false,
                        video: {
                            width: _this.videoWidth,
                            height: _this.videoHeight,
                            transform: 'scaleX(-1)'
                        }
                    };
                    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                        // 旧的浏览器可能没有srcObject
                        if ('srcObject' in _this.thisVideo) {
                            _this.thisVideo.srcObject = stream
                        } else {
                            // 避免在新的浏览器中使用它，因为它正在被弃用
                            _this.thisVideo.src = window.URL.createObjectURL(stream)
                        }
                        _this.thisVideo.onloadedmetadata = function () {
                            _this.thisVideo.play()
                        }
                    }).catch(() => {
                        this.$notify({
                            title: '警告',
                            message: '没有开启摄像头权限或浏览器版本不兼容.',
                            type: 'warning'
                        });
                    });
                });
            },
            // base64转成文件后上传
            onUpload() {
                // TODO: 文件上传
                if (this.imgSrc) {
                    const file = this.imgSrc;               //把整个base64给file
                    const time = this.getTimestamp();       //获取时间戳
                    const name = time + ".png";             //定义文件名字(例如：abc.png ， cover.png)
                    const conversions = this.dataURLtoFile(file, name);     //调用base64转图片方法
                    const data = new FormData();
                    data.append('file', conversions);
                    data.append("user_id", localStorage.getItem("tempUserId"));
                    this.loading = true;
                    axios.post("/8081api/face/upload", data).then((res) => {
                        console.log(res.data.code);
                        if (res.data.code === 1) {
                            ElMessage.success({
                                message: '人脸验证成功',
                                type: 'success'
                            });
                            // 设置缓存
                            localStorage.setItem("userId", localStorage.getItem("tempUserId"));
                            localStorage.setItem("userRole", localStorage.getItem("tempUserRole"));
                            localStorage.setItem("username", localStorage.getItem("tempUsername"));
                            localStorage.setItem("portrait", localStorage.getItem("tempPortrait"));
                            window.location.href = "/#/the_staff_detail";
                        } else {
                            ElMessage.error('人脸验证失败');
                        }
                        this.loading = false;
                    });
                } else {
                    ElMessage.error("请点击拍照");
                }
            },
            getTimestamp() {
                let time = new Date();
                let year = time.getFullYear();
                let month = time.getMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }
                let date = time.getDate();
                if (date < 10) {
                    date = "0" + date;
                }
                let hours = time.getHours();
                if (hours < 10) {
                    hours = "0" + hours;
                }
                let minutes = time.getMinutes();
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                let seconds = time.getSeconds();
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                let milliseconds = time.getMilliseconds();
                if (milliseconds < 10) {
                    milliseconds = "00" + milliseconds;
                } else if (milliseconds < 100) {
                    milliseconds = "0" + milliseconds;
                }

                return year + month + date + hours + minutes + seconds + milliseconds;
            },
            //base64转文件
            dataURLtoFile(dataurl, filename) {
                let arr = dataurl.split(',');
                let mime = arr[0].match(/:(.*?);/)[1];
                let bstr = atob(arr[1]);
                let n = bstr.length;
                let u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                return new File([u8arr], filename, {type: mime})
            },
        },

        created() {
            window.addEventListener('resize', this.GetWindowInfo); //注册监听器
            this.height = window.innerHeight+"px"; // 高

            // 清理浏览器本地缓存, 用户身份失效
            localStorage.removeItem("userId");
            localStorage.removeItem("userRole");
            localStorage.removeItem("tempUserId");
            localStorage.removeItem("tempUserRole");
            localStorage.removeItem("tempUsername");
            localStorage.removeItem("tempUserPortrait");
            // console.log(localStorage.getItem("userId"));
        }
    }
</script>

<style scoped>
    .login-form-layout {
        position: absolute;
        left: 0;
        right: 0;
        width: 360px;
        margin: 140px auto;
        border-top: 10px solid #409EFF;
    }

    .login-title {
        text-align: center;
    }

    .login-center-layout {
        background: #409EFF;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        margin-top: 200px;
    }

    .box {
        display: flex;
        justify-content: space-between;
    }

    .canvas {
        border: 1px solid #e8e8e8;
    }
</style>

<style>
    body{
        margin: 0;
    }
</style>
