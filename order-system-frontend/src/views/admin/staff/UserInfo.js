export let getRoleNum = function (role){
    if(role=='管理员'){
        return 1;
    }else if(role=='服务员'){
        return 2;
    }else if(role=='厨师'){
        return 3;
    }
}

export let getRoleStr = function (role){
    if(role==1){
        return '管理员';
    }else if(role==2){
        return '服务员';
    }else if(role==3){
        return '厨师';
    }
}
