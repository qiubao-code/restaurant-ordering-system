<template>
    <Header />
    <SideBar />
    <div class="content-box">
        <div class="content">
            <router-view></router-view>
<!--            <router-view v-slot="{ Component }">-->
<!--                <transition name="move" mode="out-in">-->
<!--                    <keep-alive>-->
<!--                        <component :is="Component" />-->
<!--                    </keep-alive>-->
<!--                </transition>-->
<!--            </router-view>-->
        </div>
    </div>
</template>

<script>
    import Header from "../components/Header";
    import SideBar from "../components/SideBar";

    export default {
        name: "Home",

        components: {
            Header,
            SideBar
        }
    }
</script>

<style>
body{
    margin: 0;
}
</style>

<style scoped>
.content-box {
    position: absolute;
    left: 250px;
    right: 0;
    padding: 0px;
    margin: 0px;
    top: 70px;
    bottom: 0;
    padding-bottom: 0;
    -webkit-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out;
    /* background: rgb(240, 242, 245); */
    background: white;
    /* background-image: linear-gradient(#c6e2ff, #ecf5ff); */
    /* background-image: linear-gradient( #f4f4f5,  #0000); */
}

.content {
    width: 100%;
    height: 100%;
    padding: 30px;
    margin: 0px;
    overflow-y: scroll;
    box-sizing: border-box;
}

/* ----------------- 动画 ----------------*/
@keyframes move-down {
    0%{
        transform: translateY(-300px);
    }
    50%{
        transform: translateY(-150px);
    }
    100%{
        transform: translateY(0px);
    }
}

.animation-down{
    animation: move-down 1.5s;
    animation-timing-function:ease;
}

@keyframes move-left {
    0%{
        transform: translateX(100px);
    }
    50%{
        transform: translateX(50px);
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