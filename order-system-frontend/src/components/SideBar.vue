<template>
    <div class="sidebar">
<!--    <el-row>-->
<!--        <el-col :span="4">-->
            <el-menu
                    class="sidebar-el-menu"
                    default-active="2"
                    @open="handleOpen"
                    @close="handleClose">
                <template v-for="item in menuList">
                    <!--子级菜单, 最多两级-->
                    <template v-if="item.children.length">
                        <el-sub-menu :index="item.id">
                            <template #title>
                                <el-icon>
                                    <Edit/>
                                </el-icon>
                                <span>{{item.name}}</span>
                            </template>
                            <template v-for="item2 in item.children">
                                <el-menu-item :index="item2.id" @click="clickMenu(item2.name)">{{item2.name}}</el-menu-item>
                            </template>
                        </el-sub-menu>
                    </template>
                    <!--无子级菜单-->
                    <template v-else>
                        <el-menu-item :index="item.id" @click="clickMenu(item.name)">
                            <el-icon>
                                <Edit/>
                            </el-icon>
                            <span>{{item.name}}</span>
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
<!--        </el-col>-->
<!--    </el-row>-->
    </div>
</template>

<script>
    import axios from 'axios';
    import { Edit } from '@element-plus/icons-vue';

    export default {
        name: "SideBar",

        data () {
            return {
                menuList: [
                    {
                        name: '菜单1',
                        id: '1',
                        children: [
                            {
                                name: '菜单1-1',
                                id: '1-1',
                                children: []
                            },
                            {
                                name: '菜单1-2',
                                id: '1-2',
                                children: []
                            }
                        ]
                    },
                    {
                        name: '菜单2',
                        id: '2',
                        children: []
                    },
                    {
                        name: '菜单3',
                        id: '3',
                        children: [
                            {
                                name: '菜单3-1',
                                id: '3-1',
                                children: []
                            },
                            {
                                name: '菜单3-2',
                                id: '3-2',
                                children: []
                            },
                            {
                                name: '菜单3-3',
                                id: '3-3',
                                children: []
                            },
                        ]
                    }
                ],
            }
        },

        methods: {
            handleOpen: function (key, keyPath) {
            },
            handleClose: function (key, keyPath) {
            },

            clickMenu: function (name) {
                // console.log(name);
                if (name === '员工信息') {
                    window.location.href = '/#/manage_staff';
                } else if (name === '添加员工') {
                    window.location.href = '/#/add_staff';
                } else if (name === '菜品信息') {
                    window.location.href = '/#/manage_food';
                } else if (name === '添加菜品') {
                    window.location.href = '/#/add_food';
                } else if (name === '正在进行的订单') {
                    window.location.href = '/#/manage_order';
                }else if (name === '已完成订单') {
                    window.location.href = '/#/finish_order';
                } // -------------------- LMJ CHANGE---------------------------
                else if (name === '销售业绩') {
                    window.location.href = '/#/history_manage';
                } else if (name === '销售统计') {
                    window.location.href = '/#/data_statistic';
                } // ---------------------  END ---------------------------------
                else if (name === '发布公告') {
                    window.location.href = '/#/public_notice';
                }
                else if (name === '所有公告' && localStorage.getItem("userRole") === '3') {
                    window.location.href = '/#/kitchen/notice';
                } else if (name === '未出餐') {
                    window.location.href = '/#/kitchen/not_finish_order';
                } else if (name === '已出餐') {
                    window.location.href = '/#/kitchen/finish_order';
                } else if (name === '通知服务员') {
                    window.location.href = '/#/kitchen/message';
                } 
                // window.location.href = href
            }
        },

        created() {
            // TODO: 动态菜单
            // 管理员菜单
            let role = localStorage.getItem("userRole");
            if (role === '1') {
                axios.get('/8084api/menu/administrator').then((res) => {
                    // console.log(res.data.data);
                    this.menuList = res.data.data;
                    for (let i = 0; i < this.menuList.length; i++) {
                        this.menuList[i].id = this.menuList[i].id + "";
                        if (this.menuList[i].children.length > 0) {
                            for (let j = 0; j < this.menuList[i].children.length; j++) {
                                this.menuList[i].children[j].id = this.menuList[i].children[j].id + "";
                            }
                        }
                    }
                });
            } else if (role === '2') {  // 服务员菜单
                axios.get('/8084api/menu/waiter').then((res) => {
                    // console.log(res.data.data);
                    this.menuList = res.data.data;
                    for (let i = 0; i < this.menuList.length; i++) {
                        this.menuList[i].id = this.menuList[i].id + "";
                        if (this.menuList[i].children.length > 0) {
                            for (let j = 0; j < this.menuList[i].children.length; j++) {
                                this.menuList[i].children[j].id = this.menuList[i].children[j].id + "";
                            }
                        }
                    }
                });
            } else {        // 后厨菜单
                axios.get('/8084api/menu/kitchen').then((res) => {
                    // console.log(res.data.data);
                    this.menuList = res.data.data;
                    for (let i = 0; i < this.menuList.length; i++) {
                        this.menuList[i].id = this.menuList[i].id + "";
                        if (this.menuList[i].children.length > 0) {
                            for (let j = 0; j < this.menuList[i].children.length; j++) {
                                this.menuList[i].children[j].id = this.menuList[i].children[j].id + "";
                            }
                        }
                    }
                });
            }
        },

        components: {
            Edit
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar {
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse) {
        background-color: rgb(235, 241, 246);
        /* width: 300px; */
        width: 250px;
    }
    .sidebar > ul {
        height: 100%;
    }

    .el-menu-item{
        background-color: rgb(235, 241, 246);
    }
</style>