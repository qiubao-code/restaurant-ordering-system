<template>

    <!-- 日期输入框 -->
    <div class="demo-date-picker">
        <div class="block">
            <el-date-picker
                v-model="dayRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="截止日期"
                :default-time="defaultTime"
                value-format="YYYY-MM-DD"
                @change="handleChange"
            >
            </el-date-picker>
        </div>
    </div>

    <!-- 页面顶部图片 -->
    <div class="top">
        <!-- 图标 -->
        <div class="charts">
            <div class="item" id="sale-num"></div>
            <div class="item" id="sale-price"></div>
        </div>

        <!-- 今日销售额 -->
        <div class="today" style="box-shadow: var(--el-box-shadow-base);">
            <div class="item">
                <div class="text">今日销售额</div>
                <div class="num">{{todaySalesPrice}}</div>
            </div>
        </div>
    </div>

    <!-- 页面中部 -->
    <div class="medium">
        <div class="item" id="top10users"></div>
        <div class="item" id="top10foods"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { onMounted } from "vue";
import axios from 'axios';

// 渲染折线图数据
let setLineChartData = function(saleNums, salePrices, x){
    // 销售量随时间变化图
    let saleNum = echarts.init(document.getElementById("sale-num"));
    saleNum.setOption({
        title: { text: "总销售量", left: 'center' },
        tooltip: {},
        xAxis: {
            data: x,
        },
        yAxis: {},
        series: [
        {
            name: "销售量",
            type: "line",
            data: saleNums,
        },
        ],
    });
    window.onresize = function () {//自适应大小
        saleNum.resize();
    };

    //销售额随时间变化图
    let salePrice = echarts.init(document.getElementById("sale-price"));
    salePrice.setOption({
        title: { text: "总销售额", left: 'center'},
        tooltip: {},
        xAxis: {
        data: x,
        },
        yAxis: {},
        series: [
        {
            name: "销售额",
            type: "line",
            data: salePrices,
        },
        ],
    });
    window.onresize = function () {//自适应大小
        salePrice.resize();
    };
};

// 渲染饼状图数据
let setPieChartData = function(top10usersInfo, top10foodsInfo){
    // 销售榜10服务员
    let top10users =echarts.init(document.getElementById("top10users"))
    top10users.setOption({
        title: {
            text: '销售榜Top10服务员',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '具体信息',
                type: 'pie',
                radius: '50%',
                data: top10usersInfo,
                emphasis: {
                    itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    })

    // 销售榜10菜品
    let top10foods =echarts.init(document.getElementById("top10foods"))
    top10foods.setOption({
        title: {
            text: '销售榜Top10菜品',
            // subtext: 'Fake Data',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: '具体信息',
                type: 'pie',
                radius: '50%',
                data: top10foodsInfo,
                emphasis: {
                    itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    })
};

// 获取折线图数据
let getLineChartData = function(salesInfo, salesPriceInfo){
    let res = {
        x: [],
        saleNums: [],
        salePrices: []
    };

    // 得到 x 与 saleNums
    for(var i = 0, len=salesInfo.length; i < len; i++) {
        let item = salesInfo[i]
        res.x.push(item.time);
        res.saleNums.push(item.nums);
    };

    // 得到 salePrices
    for(var i = 0, len=salesPriceInfo.length; i < len; i++) {
        let item = salesPriceInfo[i]
        res.salePrices.push(item.sales);
    };

    return res
};

// 封装饼状图菜品数据
let getPieChartFoodData = function(foodList){
    let foodData = []

    // 只显示top 10数据
    for(var i = 0, len=(foodList.length<10)?foodList.length:10 ; i < len; i++) {
        let item = foodList[i]
        foodData.push({
            name: item.foodName + "[ID:"+ item.foodId + "]",
            value: item.sales
        })
    }

    return foodData
};

// 封装饼状图服务员数据
let getPieChartUserData = function(userList){
    let userData = []

    // 只显示top 10数据
    for(var i = 0, len=(userList.length<10)?userList.length:10; i < len; i++) {
        let item = userList[i]
        userData.push({
            name: item.userName + "[ID:"+ item.userId + "]",
            value: item.sales
        })
    }

    return userData
};

// 获取当前时间
let getNowTime = function() {
    let now= new Date();
    let _month = ( 10 > (now.getMonth()+1) ) ? '0' + (now.getMonth()+1) : now.getMonth()+1;
    let _day = ( 10 > now.getDate() ) ? '0' + now.getDate() : now.getDate();

    return now.getFullYear() + '-' + _month + '-' + _day;
}

// 获取前一周的时间
let getWeekAgo = function(){
    var oneweekdate = new Date(new Date()-7*24*3600*1000);
    var y = oneweekdate.getFullYear();
    var m = oneweekdate.getMonth()+1;
    var d = oneweekdate.getDate();

    return y+'-'+m+'-'+d;
};


// 页面交互
export default {
    name: "data_page",
    data() {
        return {
            dayRange: [], // 日期选择器
            todaySalesPrice: 87 //今日销售额
        };
    },
    
    // 获取数据
    created(){
        // 初始化今日销售额
        axios.get('/8081api/today_sales').then((res)=>{
            this.todaySalesPrice = res.data.data
        })
    },

    methods: {
        // 处理日期变化
        handleChange: function(){
            // 刷新折线图
            let data = new FormData();
            data.append("start", this.dayRange[0]);
            data.append("end", this.dayRange[1]);
            axios.post('/8081api/sale_change', data).then((res)=>{
                let salesPriceInfo = res.data.data;
                axios.post('/8081api/sale_num_change', data).then((res)=>{
                    let salesInfo = res.data.data;
                    let result = getLineChartData(salesInfo, salesPriceInfo)
                    setLineChartData(result.saleNums, result.salePrices, result.x);
                })
            })
        },
    },

    setup(){

        // 渲染页面，数据可视化
        onMounted(() => {

            // 初始化折线图
            let data = new FormData();
            data.append("start", getWeekAgo());
            data.append("end", getNowTime());
            axios.post('/8081api/sale_change', data).then((res)=>{
                let salesPriceInfo = res.data.data;
                axios.post('/8081api/sale_num_change', data).then((res)=>{
                    let salesInfo = res.data.data;
                    let result = getLineChartData(salesInfo, salesPriceInfo)
                    setLineChartData(result.saleNums, result.salePrices, result.x);
                })
            })

            // 初始化饼状图
            axios.get('/8081api/showTopFood').then((res)=>{
                let foodInfo = getPieChartFoodData(res.data.data);
                axios.get('/8081api/showTopWaiter').then((res)=>{
                    let userInfo = getPieChartUserData(res.data.data);
                    setPieChartData(userInfo, foodInfo);
                })
            })
        });
    },
};
</script>


<style scoped>
.content{
    padding: 5px;
}
.top{
    display: flex;
}
.medium{
    display: flex;
    width: 100%;
}
.top .charts{
    display: flex;
    flex: 1;
}
.top .today{
    background-color:  #79bbff;
    width: 170px;
    height: 170px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
}
.top .charts .item{
    flex: 1;
    height: 300px;
}
.medium .item{
    flex: 1;
    height: 500px;
}
.today .text{
    color: rgb(255, 255, 255);
    font-weight: 700;
    font-size: large;
    margin: 10px;
}
.today .num{
    flex: 1;
    font-weight: 900;
    font-size: 100px;
    color: rgb(255, 255, 255);
}

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 5px;
  text-align: center;
  border-right: solid 1px var(--el-border-color-base);
  flex: 1;
}
.demo-date-picker .block:last-child {
  border-right: none;
}
.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>