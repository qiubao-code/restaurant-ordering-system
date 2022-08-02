// 修改基本完成功能

<template>
<div class="body">
    <el-row class="demo-avatar demo-basic flex-item">
        <div class="demo-basic--circle">
            <div class="block">
                <el-avatar shape="square" :size="large" :src="staffdata.portrait"></el-avatar>
            </div>
        </div>
    </el-row>
    
    <el-descriptions 
    class="margin-top flex-item"
    title="员工详情"
    :column="3"
    :size="Default"
    border
    
    >
        <template #extra>
            <el-button type="primary" @click="dialogVisible = true">修改</el-button>
            <el-button type="danger"  @click="delData()">注销</el-button>
            <el-button @click="goback()">返回</el-button>
        </template>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <user />
                    </el-icon>
                    员工编号
                </div>
            </template>
            {{staffdata.userId}}
        </el-descriptions-item>

        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <postcard />
                    </el-icon>
                    员工姓名
                </div>
            </template>
            {{staffdata.username}}
        </el-descriptions-item>

        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <avatar />
                    </el-icon>
                    员工职位
                </div>
            </template>
            {{staffdata.role}}
        </el-descriptions-item>

        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <iphone />
                    </el-icon>
                    电话号码
                </div>
            </template>
            {{staffdata.phone}}
        </el-descriptions-item>

        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <money/>
                    </el-icon>
                    员工工资
                </div>
            </template>
            {{staffdata.salary}}
        </el-descriptions-item>

        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <money />
                    </el-icon>
                    员工奖金
                </div>
            </template>
            {{staffdata.bonus}}
        </el-descriptions-item>
    </el-descriptions>

    <el-dialog
        class="flex-item"
        v-model="dialogVisible"
        destroy-on-close
        title="修改员工信息"
        width="50%"
        @close-auto-focus="handleCloseAutoFocus"
    >
        <el-form
                ref="ruleForm" :model="staffdata"
                rules="rules"
                label-width="120px"
                class="demo-ruleForm"
        >
            <el-form-item label="员工编号" prop="id" >
                <el-input style="width:100px" readonly v-model="staffdata.userId"></el-input>
            </el-form-item>
            <el-form-item label="员工姓名" prop="name" >
                <el-input style="width:100px" v-model="staffdata.username"></el-input>
            </el-form-item>
            <el-form-item label="员工职位" prop="role" >
                <el-select v-model="staffdata.role" style="width:200px" placeholder="请选择角色">
                    <el-option label="管理员" value="1"></el-option>
                    <el-option label="服务员" value="2"></el-option>
                    <el-option label="后厨人员" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="员工工资" prop="price">
<!--                <el-input style="width:100px" v-model="staffdata.salary"></el-input>-->
                <el-input-number v-model="staffdata.salary" :precision="2" :step="100"/>
            </el-form-item>
            <el-form-item label="员工奖金" prop="bonus">
<!--                <el-input style="width:100px" v-model="staffdata.bonus"></el-input>-->
                <el-input-number v-model="staffdata.bonus" :precision="2" :step="100"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="change()">确认</el-button>
                <el-button @click="cancel()">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</div>

</template>

<script>
import {getRoleNum, getRoleStr} from './UserInfo'
import axios from 'axios'
import {ElMessageBox, ElMessage} from 'element-plus'

export default {
    name:'staffdetail',
    data(){
        return{
            staffdata:{
                
            },
            // role1:''
            dialogVisible : false,
        }
    },
    created(){
        // 接收页面传值
        var this_id = parseInt(this.$route.query.id)
        console.log(this_id)

        // 获取某个员工的详细信息接口
        axios.get('/8081api/user/user_info',{params: {id:this_id}}).then((res)=>{
            let staffdata = res.data.data;
            staffdata.portrait ="http://"+(staffdata.portrait)
            console.log('staffdata',staffdata);

            // 判断是什么工位
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

        // 点击删除按钮
        delData:function(){
            // 弹出框
            ElMessageBox.confirm(
                '是否确认注销该员工',
                '注意',
                {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                }
            )
            .then(() => {
                let data = new FormData();

                data.append("id", this.staffdata.userId);                

                axios.post('/8081api/user/delete', data).then((res)=>{
                    
                    if(res.data.code == 1){
                        ElMessage({
                            type: 'success',
                            message: '注销成功',
                        });
                        window.location.href = "/#/manage_staff"
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
 
        change:function(){
            let data = new FormData();
            let staffdata = this.staffdata

            //如果修改了员工角色
            if(!Object.is(parseInt(staffdata.role), NaN)){
                data.append("role", parseInt(staffdata.role));
                this.staffdata.role = getRoleStr(this.staffdata.role)
            }
            data.append("userId", staffdata.userId);
            data.append("username", staffdata.username);
            data.append("salary", staffdata.salary);
            data.append("bonus", staffdata.bonus);

            axios.post('/8081api/user/edit', data).then((res) => {
                console.log(res.data);
                let temp = res.data;
                if(temp.code ==1){
                    this.$alert('修改成功','',{confirmButtonText:'确定'});
                    // 刷新页面
                    // location.reload();
                    this.dialogVisible = false
                }else{
                    this.$alert('修改失败','',{confirmButtonText:'确定'});
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

<script setup>
// 渲染页面
import { computed, ref } from 'vue'
import {
  Iphone,
  User,
  Money,
  Postcard,
  Avatar
} from '@element-plus/icons-vue'

const size = ref('')
const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px',
  }
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  }
})
const blockMargin = computed(() => {
  const marginMap = {
    large: '32px',
    default: '28px',
    small: '24px',
  }
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  }
})
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
</style>
