function animate(obj, target, callback) {
    // 相当于callback = function () {};
    // callback这里就相当于函数名，调用的时候在后面加()
    console.log(callback);
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        // 把步长值改成整数，避免出现小数 Math.ceil向上取整，Math.floor向下取整
        var step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft == target) {
            clearInterval(obj.timer);
            // 定时器结束的时候执行回调函数
            if (callback) {
                callback();
            }
        }
        obj.style.left = obj.offsetLeft + step + 'px';
    }, 15);
}