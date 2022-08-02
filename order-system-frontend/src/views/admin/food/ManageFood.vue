<template>
<!-- 责任人 qiu -->
  <el-card class="box-card">
    <el-row class="center" :gutter="40">
      <el-col :span="10">
        <div class="search">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入菜品编号或名称查询"
            v-model="query"
            clearable
            
          >
            <template #append>
              <el-button @click="getFoodList">搜索</el-button>
            </template>
          </el-input>
        </div>
        </el-col>
        <el-col :span="8">
        <div class="add">
          <el-button type="primary" @click="goToAddFood" target="_blank"
            >添加菜品</el-button
          >
        </div>
      </el-col>
    </el-row>
    <!-- <el-main> -->
    <!-- 食物列表 -->


     <div v-if="fooddata2.length === 0">
     <div class="food-info hover-card"
        v-for="(item, index) in fooddata.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )"
        :key="index"
     >
        <el-image :src="item.head" class="food-img"></el-image>

        <el-descriptions
        class="margin-top food-desc"
        :column="2"
        :size="size"
        @click="goToManageFood(item.id)"
        border
        >

            <el-descriptions-item :width="150">
            <template #label>
                <div class="cell-item">
                <el-icon :style="iconStyle">
                    <discount />
                </el-icon>
                编号
                </div>
            </template>
            {{item.id}}
            </el-descriptions-item>

            <el-descriptions-item :width="150">
            <template #label>
                <div class="cell-item">
                <el-icon :style="iconStyle">
                    <food />
                </el-icon>
                菜品名称
                </div>
            </template>
            {{item.name}}
            </el-descriptions-item>

            <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                <el-icon :style="iconStyle">
                    <money />
                </el-icon>
                菜品单价
                </div>
            </template>
            {{item.price}}
            </el-descriptions-item>

            <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                <el-icon :style="iconStyle">
                    <user />
                </el-icon>
                菜品类别
                </div>
            </template>
            {{item.category}}
            </el-descriptions-item>

            <!-- <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                <el-icon :style="iconStyle">
                    <tickets />
                </el-icon>
                详情
                </div>
            </template>
            <el-button type="primary" plain @click="goToManageFood(item.id)" target="_blank">查看菜品详情</el-button>
            </el-descriptions-item> -->
        </el-descriptions>
    </div>

     <div class="center" style="margin-top:15px">
            <el-pagination 
            align='center' 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="currentPage" 
            :page-sizes="[1,5,10,20]" 
            :page-size="pageSize" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="fooddata.length">
            </el-pagination>
        </div>
     </div>
      <div v-else>
    <div class="food-info hover-card"
    v-for="(item, index) in fooddata2.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )" 
    :key="index"
   >
        <el-image :src="item.head" class="food-img"></el-image>

        <el-descriptions
        class="margin-top food-desc"
        :column="2"
        :size="size"
        @click="goToManageFood(item.id)"
        border
        >
            <el-descriptions-item :width="150">
            <template #label>
                <div class="cell-item">
                <el-icon :style="iconStyle">
                    <food />
                </el-icon>
                菜品名称
                </div>
            </template>
            {{item.name}}
            </el-descriptions-item>

            <el-descriptions-item :width="150">
            <template #label>
                <div class="cell-item">
                <el-icon :style="iconStyle">
                    <discount />
                </el-icon>
                编号
                </div>
            </template>
            {{item.id}}
            </el-descriptions-item>

            <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                <el-icon :style="iconStyle">
                    <money />
                </el-icon>
                菜品单价
                </div>
            </template>
            {{item.price}}
            </el-descriptions-item>

            <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                <el-icon :style="iconStyle">
                    <user />
                </el-icon>
                菜品类别
                </div>
            </template>
            {{item.category}}
            </el-descriptions-item>

            <!-- <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                <el-icon :style="iconStyle">
                    <tickets />
                </el-icon>
                详情
                </div>
            </template>
            <el-button type="primary" plain @click="goToManageFood(item.id)" target="_blank">查看菜品详情</el-button>
            </el-descriptions-item> -->
        </el-descriptions>
    </div>
    <div class="center" style="margin-top:15px">
            <el-pagination 
            align='center' 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="currentPage" 
            :page-sizes="[1,5,10,20]" 
            :page-size="pageSize" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="fooddata2.length">
            </el-pagination>
        </div>
     </div>

    
    </el-card>
    <!-- </el-main> -->
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router';
import {
  Tickets,
  Food,
  Discount,
  User,
  Money
} from '@element-plus/icons-vue'

export default {
    el:'#managestaff',
    components: {
      Tickets,
      Food,
      Discount,
      User,
      Money
    },
    data(){
        return{
            currentPage:1,
            total:null,
            pageSize:5,
            fooddata:[{
                head:'',
                id:0,
                name:'',
                price:0,
                category:null
            }],
            fooddata2:[],
            // 搜索
            query:''
           
            // user_data1:[{
            //     head:'',
            //     name:'',
            //     id:0,
            //     role:0
            // },{
            //     head:'ss',
            //     name:'ss',
            //     id:0,
            //     role:0
            // },
            // ]
        }
    },
    created(){
        axios.get('/8081api/food/list').then((res)=>{
            console.log(res.data);
            // this.user_data=res.data.data
            let temp = res.data.data;
            let fooddata =[];
            for(let i=0;i<temp.length;i++){
                let item={
                    head:"http://" + temp[i].image,
                    id:temp[i].foodId,
                    name:temp[i].foodName,
                    price:temp[i].price,
                    category: this.getCategory(temp[i].category)
                };
                // console.log(item);
                fooddata.push(item);
            }
            this.fooddata = fooddata
            this.fooddata2=this.fooddata;
        }).catch((err)=>{
            console.log(err)
        })
    },
    methods: {
      goToAddFood: function (val) {
      // console.log(id);
      // localStorage.setItem("staffId", id);
      this.$router.push({
        path: "/add_food",
      });
      },
       // 监听 page size 改变的事件
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        // 监听 页码值 改变的事件
        handleCurrentChange (val) {
             console.log(`当前页: ${val}`);
            this.currentPage = val;
        },
        errorHandler() {
        return true
        },
        goToManageFood(id){
          console.log(id);
          //localStorage.setItem("id", id);
          this.$router.push({
          path: "/food_detail",
          query: { id: id }
        });
        },
        getCategory(category){
          if(category==1){
            return "主菜"
          }else if(category==2){
            return "小吃"
          }else{
            return "饮料"
          }
        },
        // 搜索框实现
        getFoodList: function () {
            // 处理空白
            if (this.query === '') {
                this.fooddata2 = this.fooddata;
                return;
            }

            let temp = [];
            for (let i = 0; i < this.fooddata.length; i++) {
                if (this.query === (this.fooddata[i].id + "") ||
                    this.query === (this.fooddata[i].price + "") ||
                    this.fooddata[i].name.indexOf(this.query) !== -1 ||
                    this.fooddata[i].category.indexOf(this.query) !== -1) {
                    temp.push(this.fooddata[i]);
                }
            }
            this.fooddata2 = temp;
        }
         
    },
}
</script>

<style>
.text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 90%;
    /* background-color: rgb(189, 221, 221); */
  }
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
.el-link {
  margin-right: 8px;
}
.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}
.food-img {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  
}

.food-button {
  margin-left: 30px;
  display: flex;
  flex-direction: row;
}

.food-info{
  display: flex;
  text-align: center;
  padding: 10px;
  width: 70%;
  margin: auto;
  cursor: pointer;
  /* background-color: rgba(242, 241, 246, 0.342); */
}

.food-desc{
  flex: 1;
}
.center {
  display: flex;
  justify-content: center;
  margin: 20px;
  padding-left: 40px;
}
.hover-card:hover{
    transform: translate(-2px,-2px);
    box-shadow: 3px 3px 3px #888888;
}
</style>