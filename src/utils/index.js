let timer = null; //定时器id
export const debounce = (func,time)=>{   //防抖
    if(timer)clearTimeout(timer)
    timer = setTimeout(()=>{
        func();
    },time)
}