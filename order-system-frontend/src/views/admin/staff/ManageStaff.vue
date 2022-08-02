// wangyue optimize
// version 2.0
<template>
  <div id="managestaff">
    <el-row class="center">
      <div class="search">
        <!-- 搜索框 -->
        <el-input
          placeholder="输入员工姓名或编号搜索"
          v-model="query"
          clearable
          @change="getUserList"
        >
          <template #append>
            <el-button @click="getUserList">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div class="add">
        <el-button type="primary" @click="goToAddStaff" target="_blank"
          >添加员工</el-button
        >
      </div>
    </el-row>

    <div v-if="search_data.length === 0">
      <el-card
        class="box-card hover-card"
        v-for="item in search_data.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )"
        :key="item.id"
      >
        <div class="text item" @click="goToManageStaff(item.id)">
          <el-descriptions direction="vertical" :column="6" title="员工信息卡">
            <el-descriptions-item
              ><!-- 头像 -->
              <el-row class="demo-avatar demo-basic">
                <el-col :span="7">
                  <div class="demo-basic--circle">
                    <div class="block">
                      <el-avatar :size="100" :src="item.head"></el-avatar>
                      <!-- <el-avatar :size="50" src="http://47.108.225.54:9090/img/user.png"></el-avatar>-->
                    </div>

                    <!-- <el-avatar :size="large" :src="circleUrl"></el-avatar> -->
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>

            <el-descriptions-item label="员工姓名">{{
              item.name
            }}</el-descriptions-item>

            <el-descriptions-item> </el-descriptions-item>
            <el-descriptions-item label="员工角色">
              {{ item.role }}</el-descriptions-item
            >

            <el-descriptions-item label="员工编号">{{
              item.id
            }}</el-descriptions-item>

            <!-- <el-descriptions-item>
              <el-link @click="goToManageStaff(item.id)" target="_blank">点击查看详情</el-link>
            </el-descriptions-item> -->

          </el-descriptions>
        </div>
      </el-card>
      <div class="center">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          background
          layout="prev, pager, next"
          :total="search_data.length"
        >
        </el-pagination>
      </div>
    </div>
    <div v-else>
      <el-card
        class="box-card hover-card"
        v-for="item in search_data.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )"
        :key="item.id"
      >
        <div class="text item" @click="goToManageStaff(item.id)">
          <el-descriptions direction="vertical" :column="6" title="员工信息卡">
            <el-descriptions-item
              ><!-- 头像 -->
              <el-row class="demo-avatar demo-basic">
                <el-col :span="12">
                  <div class="demo-basic--circle">
                    <div class="block">
                      <el-avatar :size="100" :src="item.head"></el-avatar>
                      <!-- <el-avatar :size="50" src="http://47.108.225.54:9090/img/user.png"></el-avatar>-->
                    </div>

                    <!-- <el-avatar :size="large" :src="circleUrl"></el-avatar> -->
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>

            <el-descriptions-item label="员工姓名">{{
              item.name
            }}</el-descriptions-item>

            <el-descriptions-item> </el-descriptions-item>
            <el-descriptions-item label="员工角色">
              {{ item.role }}</el-descriptions-item
            >

            <el-descriptions-item label="员工编号">{{
              item.id
            }}</el-descriptions-item>

            <!-- <el-descriptions-item> -->
              <!-- <el-link @click="goToManageStaff(item.id)" target="_blank">点击查看详情</el-link> -->
              <!-- <el-button @click="goToManageStaff(item.id)" type="primary">点击查看详情</el-button> -->
            <!-- </el-descriptions-item> -->
          </el-descriptions>
        </div>
      </el-card>
      <div class="center">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          background
          layout="prev, pager, next"
          :total="search_data.length"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<!--<script setup>-->
<!--// 渲染页面-->
<!--import { computed, ref } from 'vue'-->
<!--import {-->
<!--  User,-->
<!--  Postcard,-->
<!--  Avatar-->
<!--} from '@element-plus/icons-vue'-->

<!--const size = ref('')-->
<!--const iconStyle = computed(() => {-->
<!--  const marginMap = {-->
<!--    large: '8px',-->
<!--    default: '6px',-->
<!--    small: '4px',-->
<!--  }-->
<!--  return {-->
<!--    marginRight: marginMap[size.value] || marginMap.default,-->
<!--  }-->
<!--})-->
<!--const blockMargin = computed(() => {-->
<!--  const marginMap = {-->
<!--    large: '32px',-->
<!--    default: '28px',-->
<!--    small: '24px',-->
<!--  }-->
<!--  return {-->
<!--    marginTop: marginMap[size.value] || marginMap.default,-->
<!--  }-->
<!--})-->
<!--</script>-->


<script>
import axios from "axios";
export default {
  el: "#managestaff",
  data() {
    return {
      query: "",
      pageSize: 5,
      currentPage: 1,
      user_data: [
        {
          head: "",
          name: "",
          id: 0,
          role: "",
        },
      ],
      search_data: [],
    };
  },
  created() {
    axios
      .get("/8081api/user/list")
      .then((res) => {
        // console.log(res.data);
        // this.user_data=res.data.data
        let temp = res.data.data;
        // console.log(temp);
        let user_data = [];

        for (let i = 0; i < temp.length; i++) {
          let item = {
            head: "http://" + temp[i].portrait,
            name: temp[i].username,
            id: temp[i].userId,
            role: temp[i].role,
          };
          if (item.role === 1) {
            item.role = "管理员";
          } else if (item.role === 2) {
            item.role = "服务员";
          } else if (item.role === 3) {
            item.role = "厨师";
          }
          // console.log(item);
          user_data.push(item);
        }

        this.user_data = user_data;
        this.search_data = this.user_data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    getUserList: function () {
      if (this.query === "") {
        this.search_data = this.user_data;
        return;
      }

      let temp = [];
      // console.log(this.user_data[1].name.indexOf(this.query));
      // console.log(this.query === this.user_data[1].id + "");
      for (let i = 0; i < this.user_data.length; i++) {
        if (
          this.query === this.user_data[i].name ||
          this.query === this.user_data[i].id + "" ||
          this.user_data[i].name.indexOf(this.query) !== -1
        ) {
          temp.push(this.user_data[i]);
        }
      }
      this.search_data = temp;
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    errorHandler() {
      return true;
    },

    goToManageStaff: function (id) {
      // console.log(id);
      // localStorage.setItem("staffId", id);
      this.$router.push({
        path: "/staff_detail",
        query: { id: id },
      });
    },

    goToAddStaff: function (val) {
      // console.log(id);
      // localStorage.setItem("staffId", id);
      this.$router.push({
        path: "/add_staff",
      });
    },
  },
};
</script>

<style>
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
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}
.search {
  display: flex;
  justify-content: center;
  width: 300px;
  margin: 20px;
}
.add {
  display: flex;
  justify-content: right;
  margin: 20px;
}
.hover-card{
  margin: 10px 50px;
}
.hover-card:hover{
  margin: 10px 50px;
  transform: translate(-20px,-15px);
  box-shadow: 5px 5px 5px #888888;
}
</style>