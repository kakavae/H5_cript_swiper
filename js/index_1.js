window.addEventListener('load', function () {
    // 1.获取元素 添加事件
    var focus = document.querySelector('.focus');
    var arrow_left = document.querySelector('.arrow_left');
    var arrow_right = document.querySelector('.arrow_right');
    var ul = focus.querySelector('ul');
    var offsetWidth = focus.offsetWidth;

    // 2.添加事件 鼠标经过的时候显示左右箭头 离开的时候隐藏左右箭头
    focus.addEventListener('mouseenter', function () {
        arrow_left.style.display = 'block';
        arrow_right.style.display = 'block';
        // 鼠标经过的时候停止播放，也就是删除定时器
        clearInterval(timer);
    })

    focus.addEventListener('mouseleave', function () {
        arrow_left.style.display = 'none';
        arrow_right.style.display = 'none';
        // 鼠标离开的时候打开定时器
        timer = setInterval(function () {
            // 相当于一直点击这个元素
            arrow_right.click();
        }, 2000);
    })

    // 3.动态生成小圆圈，有几个li就生成几个小圆圈，实现自动化
    var ol = document.querySelector('.circle');
    for (var i = 0; i < ul.children.length; i++) {
        // (1).创建li节点
        var li = document.createElement('li');
        // 给每个ol里面的li设置自定义属性索引号
        li.setAttribute('index', i);
        // (2).插入li节点
        ol.appendChild(li);
        // 4.小圆圈的排他思想，点击当前的小圆圈就给当前的小圆圈添加current类，清除其余的小圆圈的className
        li.addEventListener('click', function () {
            for (j = 0; j < ol.children.length; j++) {
                ol.children[j].className = '';
            }
            this.className = 'current';
            // 5.点击小圆圈之后，轮播图切换
            // 轮播图移动的距离就是负的li索引号乘以图片的宽度
            var index = this.getAttribute('index');
            // 点击当前的小圆圈之后，获取到当前的index，并且把这个index给num 和 circle
            num = index;   //控制轮播图是那一张图片
            circle = index;  //控制左右按键切换和下面小圆点切换的搭配
            animate(ul, -index * offsetWidth);
        })
    }
    // 把ol里面的第一个li的类设置为.current 实心圆
    ol.children[0].className = 'current';

    // 6.克隆第一张照片，放在ul的最后面，用js单独生成的图片
    var lili = ul.children[0].cloneNode(true);  //true是深克隆，会复制里面的子节点  false浅克隆 不复制里面的子节点
    ul.appendChild(lili);

    // 7.点击右侧按钮，图片滚动一张
    // 声明一个num变量，每次点击就给num自增1，让这个变量乘以图片的宽度，就是ul的滚动距离
    var num = 0;
    var circle = 0;
    // 节流阀flag 防止多次点击按钮轮播图播放过快
    // 原理：回调函数只有在动画完成之后才会执行，动画执行期间flag都是false，所以点击按钮是没有反应的
    var flag = true;
    arrow_right.addEventListener('click', function () {
        if (flag) {
            flag = false;
            // 无缝滚动的原理：第一张图片复制一份放到最后面，播放到最后一张图片的时候再点击，就到了复制的第一张照片，等到下次点击的时候，立马跳转到第一张照片，然后继续滚动
            // 长度是5，前一次循环num已经是4了，所以已经播放到五张照片也就是新增加的那张照片了，下一次点击就判断出等于5-1=4，这时候num=0，直接跳转到left=0的位置
            // if (num === ul.children.length - 1) {
            //     num = 0;
            //     ul.style.left = 0;
            // }
            // num++;
            // 替换为和下面的circle一样的形式：
            if (num === ul.children.length - 1) {
                num = 0;
                ul.style.left = 0;
            }
            num++;
            animate(ul, -num * offsetWidth, function () {
                flag = true;
            });
            // 每次点击右侧按钮，circle自增1，同时ol里面第circle个li的类名变为current,其余的变为'', 排它思想
            // 前面已经更改了第一个的样式，所以打开的时候就是实心的
            // 注意这里第一次点击就应该变为1，而不是0，因为第一次点击就对应着第二个小圆圈
            // 从0开始递增，增加到4的时候，这个时候第四个圈的className应该是current,因为是第三个孩子
            circle++;   //注意这里circle++的位置
            if (circle === ol.children.length) {
                circle = 0;
            }
            //注意这里是回到0，因为一次循环之后，循环末位点击按钮，应该跳到了第一张，第一张对应的circle就是0.后面再递增，相当于重新开始
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            ol.children[circle].className = 'current';
        }

    })

    // 9.点击左侧按钮，图片滚动一张
    // 声明一个num1变量，每次点击就给num1自减1，让这个变量乘以图片的宽度，就是ul的滚动距离
    arrow_left.addEventListener('click', function () {
        if (flag) {
            flag = false;
            // 如果现在num已经是0，再点击一次，就让ul跳转到前面复制的那个图片的位置，再向左做轮播效果
            if (num === 0) {
                num = ul.children.length - 1;
                ul.style.left = -num * offsetWidth + 'px';  //注意这里要加px单位！！！！
            }
            num--;
            // 注意我们封装的函数第二个参数是需要移动到的目标位置，不是过程中的距离
            animate(ul, - num * offsetWidth, function () {
                flag = true;
            });

            circle--;
            if (circle < 0) {
                circle = ol.children.length - 1;
            }
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            ol.children[circle].className = 'current';
        }
    })
    // 10自动播放轮播图 
    // 使用手动调动右侧按钮点击事件 arrow_right.click()
    var timer = setInterval(function () {
        arrow_right.click();
    }, 2000);
})