<template>
    <div class="header">
        <div class="system-info">
            <img src="../assets/logo.png"/>
            <div class="text">饱了么-智能餐厅后台系统</div>
        </div>

        <div class="user-info">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-avatar :src="avatarUrl"></el-avatar>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item> 姓名: {{name}}</el-dropdown-item>
                        <el-dropdown-item> 我的ID: {{id}}</el-dropdown-item>
                        <el-dropdown-item @click="changeInfo()">修改个人信息</el-dropdown-item>
                        <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<!--<script setup>-->
<!--import {-->
<!--  DataLine-->
<!--} from '@element-plus/icons-vue'-->

<!--</script>-->


<script>
    import axios from 'axios';

    export default {
        name: "Header",

        data () {
            return {
                id: '123',
                name: '颜晓菁',
                avatarUrl: '',
            }
        },

        created() {
            this.id = localStorage.getItem("userId");
            this.name = localStorage.getItem("username");
            this.avatarUrl = localStorage.getItem("portrait")
            console.log(this.avatarUrl);
        },

        methods:{
            changeInfo: function(){
                window.location.href = '/#/the_staff_detail';
            },
            logout: function(){
                window.location.href = '/#/';
            }
        }
    }
</script>

<style scoped>
    .header {
        width: 100%;
        height: 68px;
        margin: 0;
        padding: 0;
        background-color: rgb(235, 241, 246);
        display: flex;
        align-items: center;
        border-bottom-style: double;
        border-bottom-width: 1.5px;
        border-bottom-color: rgb(18, 150, 219);
    }

    .user-info{
        width: 50px;
        margin-right: 10px;
    }

    .system-info{
        flex: 1;
        display: flex;
        align-items: center;
    }

    .system-info img{
        margin: auto 20px;
        width: 60px;
    }

    .system-info .text{
        color: rgb(92, 93, 95);
        font-weight: 700;
        font-size: 19px;
    }
</style>