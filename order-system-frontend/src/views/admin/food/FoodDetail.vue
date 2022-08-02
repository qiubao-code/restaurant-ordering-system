// 修改基本完成功能

<template>
<div class="body animation-left" style="box-shadow: var(--el-box-shadow-base);">
    <!-- 图片 -->
    <div class="demo-image" style="box-shadow: var(--el-box-shadow-base);">
        <el-image
            style="width: 200px; height: 200px"
            :src="fooddata.image"
            :fit="fit"
        ></el-image>
    </div>
    
    <el-descriptions
        class="el-desc"
        title="菜品详情"
        :column="3"
        :size="Default"
        border
    >
        <template #extra>
            <el-button type="primary" @click="dialogVisible = true">修改</el-button>
            <el-button type="danger"  @click="delData()">删除</el-button>

            <el-button v-if="fooddata.isLike == 0" type="success" @click="setLike()">推荐菜品</el-button>
            <el-button v-if="fooddata.isLike == 1" type="danger" @click="setNotLike()">取消推荐</el-button>

            <el-button v-if="fooddata.isAvailable == 1" type="danger" @click="notAvailable()">标记售罄</el-button>
            <el-button v-if="fooddata.isAvailable == 0" type="success" @click="setAvailable()">标记有货</el-button>

            <el-button @click="goback()">返回</el-button>
        </template>

        <!-- <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <discount />
                    </el-icon>
                    菜品编号
                </div>
            </template>
            {{fooddata.foodId}}
        </el-descriptions-item> -->

        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <food />
                    </el-icon>
                    菜品名称
                </div>
            </template>
            <div style="width:120px">
                {{fooddata.foodName}}
                <el-tag>ID:{{fooddata.foodId}}</el-tag>
            </div>
        </el-descriptions-item>

        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <tickets />
                    </el-icon>
                    菜品分组
                </div>
            </template>
            {{fooddata.category}}
        </el-descriptions-item>

        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <money />
                    </el-icon>
                    菜品价格
                </div>
            </template>
            {{fooddata.price}}
        </el-descriptions-item>

        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <discount/>
                    </el-icon>
                    是否有库存
                </div>
            </template>
            {{fooddata.isAvailable==1?'是':'否'}}
        </el-descriptions-item>

        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <tickets />
                    </el-icon>
                    菜品介绍
                </div>
            </template>
            {{fooddata.description}}
        </el-descriptions-item>
    </el-descriptions>
</div>

<!-- 修改弹出框 -->
    <el-dialog
    v-model="dialogVisible"
    destroy-on-close
    title="修改菜品信息"
    width="50%"
    @close-auto-focus="handleCloseAutoFocus"
    >
        <el-form
            ref="ruleForm" :model="fooddata"
            rules="rules"
            label-width="120px"
            class="demo-ruleForm"
            >
                <el-form-item label="菜品名称" prop="foodName" >
                    <el-input style="width:100px" v-model="fooddata.foodName"></el-input>
                </el-form-item>

                <el-form-item label="菜品价格" prop="price" >
                    <el-input style="width:100px" placeholder="川菜" v-model="fooddata.price"></el-input>
                </el-form-item>

                <el-form-item label="菜品分组" prop="category" >
                    <el-select v-model="fooddata.category" style="width:200px" placeholder="主菜">
                        <el-option label="主菜" value="1"></el-option>
                        <el-option label="小吃" value="2"></el-option>
                        <el-option label="饮料" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="菜品简介" prop="introduce" >
                  <el-input type="textarea" v-model="fooddata.description"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="change()">确认</el-button>
                  <el-button >取消</el-button>
                </el-form-item>
            </el-form>
    </el-dialog>
</template>

<!--<script setup>-->
// import {
//   Tickets,
//   Food,
//   Discount,
//   User,
//   Money
// } from '@element-plus/icons-vue'
// import { reactive, ref } from 'vue';
//
// const size = ref('')
// const iconStyle = computed(() => {
//   const marginMap = {
//     large: '8px',
//     default: '6px',
//     small: '4px',
//   }
//   return {
//     marginRight: marginMap[size.value] || marginMap.default,
//   }
// })
// const blockMargin = computed(() => {
//   const marginMap = {
//     large: '32px',
//     default: '28px',
//     small: '24px',
//   }
//   return {
//     marginTop: marginMap[size.value] || marginMap.default,
//   }
// })
<!--// </script>-->

<script>
import axios from 'axios';
import { ElMessageBox, ElMessage } from 'element-plus';
import { Tickets, Food, Discount, User, Money } from '@element-plus/icons-vue';
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
// import { isLeaf } from 'element-plus/lib/utils'

export default {
    name:'fooddetail',
    data(){
        return{
            fooddata:{

            },
            // role1:''
            dialogVisible : false,

            size: '',
        }
    },

    computed: {
        iconStyle: function () {
            this.size = ref('');
            const marginMap = {
                large: '8px',
                default: '6px',
                small: '4px',
            };
            return {
                marginRight: marginMap[size.value] || marginMap.default,
            }
        }
    },

    components: {
        Tickets,
        Food,
        Discount,
        User,
        Money
    },

    created(){
        // 获取某个菜品的详细信息接口
        //let id = localStorage.getItem("id");
        //console.log(id);

        // 接收页面传值
        let this_id = this.$route.query.id;
        

        axios.get('/8081api/food/select_by_id',{
            params: {
                id: this_id
            }
        }).then((res)=>{
            let fooddata = res.data.data;
            
            // 图片显示
            fooddata.image= "http://" +  fooddata.image;

            // 菜品种类判断
            if(fooddata.category === 1){
                fooddata.category='主菜';
            }else if(fooddata.category === 2){
                fooddata.category='小吃';
            }else if(fooddata.category === 3){
                fooddata.category='饮料';
            }

            // 数据渲染
            this.fooddata = fooddata;
            console.log(fooddata)
        }).catch((err)=>{
            console.log(err)
        })
    },
    methods:{
        setLike:function(){
            this.fooddata.isLike = 1;

            let data = new FormData();
            data.append("id", this.fooddata.foodId);

            axios.post('/8081api/food/set_like', data).then((res)=>{
                 console.log(res.data)
             })
        },
        setNotLike:function(){
            this.fooddata.isLike = 0;

            let data = new FormData();
            data.append("id", this.fooddata.foodId);

            axios.post('/8081api/food/set_not_like', data).then((res)=>{
                 console.log(res.data)
             })
          },
        notAvailable: function(){
            this.fooddata.isAvailable = 0;

            let data = new FormData();
            data.append("id", this.fooddata.foodId);

            axios.post('/8081api/food/set_not_available', data).then((res)=>{
                // console.log(res.data);
                if(res.data.code !== -1){
                    ElMessage({
                        message: '设置成功',
                        type: 'success'
                    });
                }
            })
        },
        setAvailable: function() {
            let data = new FormData();
            data.append("id", this.fooddata.foodId);
            this.fooddata.isAvailable = 1;

            axios.post('/8081api/food/set_available', data).then((res)=>{
                // console.log(res.data)
                if(res.data.code !== -1){
                    ElMessage({
                        message: '设置成功',
                        type: 'success'
                    });
                }
            })
        },
        // 点击删除按钮
        delData:function(){
            // 弹出框
            ElMessageBox.confirm(
                '是否确认删除该菜品',
                '注意',
                {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                }
            )
                .then(() => {
                    let data = new FormData();
                    data.append("id", this.fooddata.foodId);

                    axios.post('/8081api/food/delete', data).then((res)=>{
                        console.log(res.data);
                        if(res.data.code === 1){
                            ElMessage({
                                type: 'success',
                                message: '删除成功',
                            });
                            window.location.href = "/#/manage_food"
                        }else{
                            console.log(res.data.msg);
                            ElMessage({
                                type: 'error',
                                message: '删除失败',
                            });

                        }
                    })

                
            })
        },
    
        change:function(){
            let data = new FormData();
            let food = this.fooddata;

            // console.log(food);

            data.append("foodId", food.foodId);
            data.append("price", food.price);
            data.append("foodName", food.foodName);
            data.append("description", food.description);
            switch(food.category){
                case '主菜': food.category = 1; break;
                case '饮料': food.category = 2; break;
                case '小吃': food.category = 3; break; 
            }
            data.append("category", food.category);

             axios.post('/8081api/food/edit', data).then((res) => {
                    console.log(res.data);
                    let temp = res.data;
                    if(temp.code === 1){
                        // this.$alert('修改成功','',{confirmButtonText:'确定'});
                        ElMessage({
                            message: '修改成功',
                            type: 'success'
                        });
                        location.reload()
                    }else{
                        ElMessage({
                            message: '修改失败',
                            type: 'warning'
                        });
                    }
              }).catch(function (error) {
              console.log(error);
              });
        },

        goback:function(){
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
.body{
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px auto;
    padding: 10px;
    /* background-image: linear-gradient(rgb(235, 241, 246), #FFFFFF 40%, rgb(235, 241, 246)); */
    border-radius: 15px;
}
.body:hover{
    /* transform: translate(-10px,-10px); */
    box-shadow: 15px 15px 15px #888888;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.cell-item{
    width: 95px;
}
.el-desc{
    margin: 25px;
}
.demo-image{
    margin: 30px auto;
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