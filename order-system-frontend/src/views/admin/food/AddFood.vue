<template>
    <el-container>
        <el-main>
            <el-form
                ref="ruleForm" :model="ruleForm"
                :rules="rules"
                label-width="120px"
                class="total-div" 
                style="box-shadow: var(--el-box-shadow-base);"
            >

                <el-form-item class="img-div" prop="image">
                    <el-upload action=""
                            class="avatar-uploader"
                            list-type="picture-card"
                            multiple=false
                            limit=1
                            :auto-upload=false
                            :on-change="fileOnchange"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :before-upload="beforeAvatarUpload"
                        >
                        <el-icon><plus/></el-icon>
                    </el-upload>
                </el-form-item>

                <div class="text-div">
                    <el-form-item label="菜品名称" prop="foodName" >
                        <el-input placeholder="宫保鸡丁" v-model="ruleForm.foodName"></el-input>
                    </el-form-item>

                    <el-form-item label="菜品类别" prop="category" >
                        <el-select v-model="ruleForm.category" placeholder="主菜">
                            <el-option 
                                v-for="item in category"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="菜品价格" prop="price" >
                        <el-input-number v-model="ruleForm.price" :precision="2" :step="0.1"/>
                    </el-form-item>

                    <el-form-item label="菜品详情" prop="description">
                        <el-input
                        v-model="ruleForm.description"
                        :rows="3"
                        type="textarea"
                        placeholder="请输入菜品详情"></el-input>
                    </el-form-item>

                    <el-form-item label="是否推荐" prop="isLike">
                        <el-rate size="large" v-model="ruleForm.isLike" max=1></el-rate>
                    </el-form-item>

                    <el-form-item label="是否有可售" prop="isAvailable">
                        <el-rate size="large" v-model="ruleForm.isAvailable" max=1></el-rate>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
                    </el-form-item>
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
    padding: 40px;
}
.text-div{
    display: flex; 
    flex: 1;
    flex-direction: column
}
.img-div{
    /* flex: 1; */
    padding: 10px;
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
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: #8c939d dotted;
  border-radius: 4px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<script>
    import {ElMessage} from "element-plus";
    import axios from 'axios';
    import { Plus } from '@element-plus/icons-vue'

    export default {
        name:"",
        components:{
            Plus
        },

        data(){
          return{
            category:[
                {
                    value:'1',
                    label:"主菜",
                },{
                    value:'2',
                    label:"小吃",
                },{
                    value:'3',
                    label:"饮料",
                },

            ],
            ruleForm: {
                foodName: null,
                category: null,
                price: null,
                description: null,
                isLike: 0,
                image: null,
                isAvailable: 0
            },
            fileList: [],
            param2: new FormData(),
            rules:{
                foodName: [
                    {
                        required: true,
                        message: '请输入菜品名称',
                        trigger: 'blur',
                    }
                ],
                category: [
                    {
                        required: true,
                        message: '请输入菜品类别',
                        trigger: 'blur',
                    }
                ],
                price: [
                    {
                        required: true,
                        message: '请输入菜品价格',
                        trigger: 'blur',
                    }
                ],
            }
          }
        },
        methods:{
            // 是否推荐菜品
            // setLike:function(){
            //     if(this.ruleForm.isLike === 1)
            //         this.ruleForm.isLike = 0;
            //     else this.ruleForm.isLike = 1;
            // },

            //校验是否上传图片
            // checkImage: function(rule, value, callback){
            //     if(this.ruleForm.image === null){
            //         callback()
            //     } else {
            //         return new Error('请上传图片');
            //     }
            // },

            //提交添加请求
            submitForm: function(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid || this.ruleForm.image == null) {
                        ElMessage({
                            message: '填写信息不完整或错误，或未上传图片',
                            type: 'error',
                        });
                        return false;
                    }else {
                        this.addData();
                    }
                });
            },

            //添加菜品
            addData:function(){
                let ruleForm = this.ruleForm
                console.log('ruleForm:',ruleForm)

                // 数据处理
                ruleForm.category = parseInt(ruleForm.category)
                ruleForm.price = parseFloat(ruleForm.price)

                // 添加到表单
                this.param2.append("foodName", ruleForm.foodName);
                this.param2.append("category", ruleForm.category);
                this.param2.append("price", ruleForm.price);
                this.param2.append("description", ruleForm.description);
                this.param2.append("isLike", ruleForm.isLike);
                this.param2.append("isAvailable", ruleForm.isAvailable);

                axios.post('/8081api/food/add', this.param2).then((res) => {
                    let temp = res.data;
                    if(temp.code == 1){
                        ElMessage({
                            message: '添加成功',
                            type: 'success'
                        });

                        this.$router.push({
                            path: "/food_detail",
                            query: { id: temp.data.foodId }
                        });
                    }else{
                        ElMessage({
                            message: '添加失败',
                            type: 'error'
                        });
                    }

                }).catch(function (error) {
                    console.log(error);
                });
            },

            //--------------------上传图片-----------------------------
            //上传头像校验[TODO]
            beforeAvatarUpload: function(file) {
                let isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
                let isLt2M = file.size / 1024 / 1024 < 2

                if (!isJPG) {
                    ElMessage.error('Avatar picture must be JPG format!')
                }
                if (!isLt2M) {
                    ElMessage.error('Avatar picture size can not exceed 2MB!')
                }
                return isJPG && isLt2M
            },

            fileOnchange: function (file,filesList){
                this.param2.append('file', file.raw, file.name);
                this.ruleForm.image = file.name;
            },

            handleRemove(file,filesList) {
                this.param2.delete('file');
                this.ruleForm.image = null;
            },
        }
    }
</script>