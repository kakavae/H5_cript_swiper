// 页面加载完毕之后才执行轮播图效果
window.addEventListener('load', () => {
    // 获取需要的页面元素
    var focus = document.querySelector('.focus');
    var ul = focus.children[0];
    // 定义ul每次移动的宽度
    var w = focus.offsetWidth;
    // 定义变量，随着定时器自增
    var index = 0;
    // 定义全局变量，当手指拖动后才会触发计算，否则不触发计算
    var flag = false;
    // 设置定时器，每隔两秒就让ul向左移动100%的focus宽度
    var timer = setInterval(() => {
        index++;
        var translateXWid = - index * w;
        ul.style.transition = 'all .5s';
        ul.style.transform = 'translateX(' + translateXWid + 'px)';
    }, 2000)

    // 当自动跳转到第四张照片并且动画效果结束之后，设置index=0,从第一张照片重新播放
    ul.addEventListener('transitionend', () => {
        if (index >= 3) {
            index = 0;
            // 去除ul的动画缓动效果，直接跳转到第一张照片
            ul.style.transition = 'none';
            // 利用最新的索引号乘以宽度去滚动图片
            // 下面的这两句负责将ul从最后一张的位置拉到第一张的位置，期间没有过渡效果
            // 拉到第一张的位置之后，等待定时器的时间到了，定时器才触发第一张照片的移动，第二章照片带着缓动的效果轮播
            translateXWid = - index * w;
            ul.style.transform = 'translateX(' + translateXWid + 'px)';
        } else if (index < 0) {
            index = 2;
            ul.style.transition = 'none';
            // 利用最新的索引号乘以宽度去滚动图片
            translateXWid = - index * w;
            ul.style.transform = 'translateX(' + translateXWid + 'px)';
        }

        // 3. 小圆点跟随当前的li的位置发生变化
        // 3.1 清除当前ol里面的li里面带有current类的元素的类名
        var ol = document.querySelector('ol');
        ol.querySelector('.current').classList.remove('current');
        // 3.2 给当前index所在的图片对应的li添加类current
        ol.children[index].classList.add('current');
    })

    // 4. 手指拖动轮播图移动
    // 4.1 当手指触摸到ul之后获取当前手指的坐标 touchstart
    // 定义初始手指坐标和移动后的手指坐标，两个全局变量
    var startX = 0;
    // 手指在ul上横向移动的距离
    var moveX = 0;
    ul.addEventListener('touchstart', (e) => {
        startX = e.targetTouches[0].pageX;
        // 手指触摸到ul之后就要停止ul的自动播放，否则会和手指拖动冲突
        clearInterval(timer);
    })
    // 4.2 当手指在ul上面移动之后获取移动后的手指坐标，两者相减，就是ul的位置需要改变的大小 touchmove
    ul.addEventListener('touchmove', (e) => {
        moveX = e.targetTouches[0].pageX - startX;
        // 给定当前ul需要移动的距离，并且不给过渡效果让ul直接移动到指定位置 原来的位置加上拖动的距离
        var translateXWid = - index * w + moveX;
        ul.style.transition = 'none';
        ul.style.transform = 'translateX(' + translateXWid + 'px)';
        flag = true;
    })
    // 4.3 手指离开之后根据当前轮播图的位置决定是播放上一张图片还是播放下一张图片
    ul.addEventListener('touchend', (e) => {
        if (flag) {
            // 当移动的绝对值大于50的时候决定播放上一张或者下一张
            if (Math.abs(moveX) > 50) {
                // 当moveX大于0的时候播放上一张图片
                // 当moveX小于0的时候播放下一张图片
                if (moveX > 0) {
                    index--;
                } else {
                    index++;
                }
                var translateXWid = - index * w;
                ul.style.transition = 'all, .3s';
                ul.style.transform = 'translateX(' + translateXWid + 'px)';
            } else {
                var translateXWid = - index * w;
                ul.style.transition = 'all, .1s';
                ul.style.transform = 'translateX(' + translateXWid + 'px)';
            }
        }
        // 手指离开的时候开启定时器
        clearInterval(timer);
        timer = setInterval(() => {
            index++;
            var translateXWid = - index * w;
            ul.style.transition = 'all .5s';
            ul.style.transform = 'translateX(' + translateXWid + 'px)';
        }, 2000)
    })

    // 当页面滚动的时候触发事件
    // 当滚动的距离大于某个盒子距离页面顶部的距离的时候，就显示goBack的盒子
    var goBack = document.querySelector('.goBack');
    var nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        // offsetTop距离页面顶部的距离
        // window.pageYOffset页面滚上去的部分的高度
        if (window.pageYOffset >= nav.offsetTop) {
            goBack.style.display = 'block';
        } else {
            goBack.style.display = 'none';
        }
    })
    // 点击goBack之后页面跳转回顶部
    goBack.addEventListener('click', () => {
        // 页面的滚动命令，就和手动滚动一样
        window.scroll(0, 0);
    })
})