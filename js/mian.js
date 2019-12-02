//除chrome外，其他支持需要在服务器上运行才支持
if(!window.localStorage){
    alert('不支持localstorage，抽奖无法启动！');
}

// 处理 localstorage 中奖数据
const local_handle = {
    local_item: "lottery_datas",
    get: function( key ) {
        const strResult = window.localStorage.getItem( key );
        if(!strResult) {
            return null;
        }else {
            return JSON.parse(window.localStorage.getItem( key ))
        }
    },

    set: function( key, val) {
        window.localStorage.setItem( key, JSON.stringify(val) );
        return val;
    },
    clear: function() {
        window.localStorage.clear()
    }
};


async function start() {

    let lottery_initial_datas = await fetch('./lottery_data.json').then(d => d.json());

    // 抽中的不在列表里
    const greedIdList = new Set(greed());
    lottery_initial_datas = lottery_initial_datas.filter(person => !greedIdList.has(person.id));
    // ---------------- 加载、渲染 滚动抽奖信息数据 ------------
    window.lottery_datas = shuffle(lottery_initial_datas);

    console.log(lottery_datas);
    $('#lottery-wrap').html( _.template($('#lotterycon-tpl').html(), lottery_datas));

    // ---------------- 抽奖动画相关参数配置 ------------
    var nextFrame = window.requestAnimationFrame,
        cancelFrame = window.cancelAnimationFrame,
        // 初始滚动速度
        speed = 6,
        // 每个对话框外部高度(包括padding与margin)
        // 注：为了方便，这里统一设置为 132+28 = 160
        item_outer_height = $('.lottery-list:eq(1)').outerHeight(true),
        item_height = $('.lottery-list:eq(1)').outerHeight(),
        // 单个抽奖框框的中间位置
        left_center_top = item_height/2 - 20,
        // 抽奖按钮
        lottery_btn = $('#lottery-btn'),
        // 是否移动
        isMove = true,
        // 抽奖是否开始
        isStart = false,
        // 设置抽奖锁
        isLock = true,
        // 是否可以关闭重开
        can_stop = false,
        // 初始移动是的定时动画变量
        timer = null,
        // 全局 setTimeout 定时任务指定变量
        setout_time = null;

    function setTopStyle(ele, y) {
        ele.style.transform = `translateY(${y}px)`;
    }
    // 嗯，just go ！
    var moveDom = document.getElementById('lottery-wrap'),
        wrapDom = document.getElementById('lottery-main'),
        list = $('#lottery-wrap .lottery-list');
    function justGo (isMove) {
        var move_height = moveDom.offsetHeight,
            wrap_height = wrapDom.offsetHeight,
            moveTop =  moveDom.offsetTop;
        var all_size = list.size();
        // 随机生成停止位置的索引
        var start_index = Math.floor(Math.random() * (all_size - 4));
        var start_top = - item_outer_height * start_index;
        var moveY = start_top;

        const moreScreenGetter = _.template($('#lotterycon-tpl').html());

        $('#lottery-wrap').html(
            $('#lottery-wrap').html() + moreScreenGetter()
        );

        var justMove = function(flag) {
            timer = nextFrame(function() {
                moveY -= speed;
                // moveDom.style.top = moveY + 'px';
                setTopStyle(moveDom, moveY);
                if (-(moveY) >= move_height) {
                    moveY = 0;
                }
                justMove(flag);
            });
        };

        if (isMove) {
            justMove(isMove);
        } else {
            return false;
        }
    }

    // 开始抽奖
    function startLottery() {
        isStart = true;
        isMove = false;
        // 在进入本轮抽奖逻辑后，开启本轮抽奖锁
        isLock = true;
        // 设置抽奖按钮状态
        lottery_btn.text('正在滚动 ^_^');
        lottery_btn.css('background', '#FFBFB7');

        setout_time = setTimeout(function () {
            speed = 15;
        }, 1000);

        setout_time = setTimeout(function () {
            speed = 20;
        }, 3000);

        setout_time = setTimeout(function () {
            speed = 30;
        }, 5000);
        setout_time = setTimeout(function () {
            speed = 40;
        }, 7000);
        setout_time = setTimeout(function () {
            speed = 50;
            $('#lottery-btn').text('可抽奖啦 @_@');
            // 当速度达到最终的设置峰值是，isLock 将会解锁，此时，才可以停止动画
            isLock = false;
            clearTimeout(setout_time);
        }, 8000);
    }

    // 结束抽奖
    async function stopLottery() {

        // 当isLock 锁还没解锁时， 此时不能停止抽奖，将会抛出没结束的异常
        if (isLock) {
            console.log('还没结束，请稍等...');
            return;
        }

        const btn = document.getElementById('lottery-btn');

        btn.disabled = true;

        speed = 25;await sleep(1000);
        speed = 20;await sleep(1000);
        speed = 15;await sleep(1000);
        speed = 10;await sleep(1000);
        speed = 7;await sleep(1000);
        speed = 5;await sleep(1000);
        speed = 3;await sleep(1000);
        speed = 2;

        var moveDom = document.getElementById('lottery-wrap');

        isStart = false;
        isMove = false;

        /*-------- 手动停止的方案 --------*/
        // 得到当前所在高度值
//        var stop_top = $('#lottery-wrap').css('top');
//        // 将当前高度值转换为绝对正值
//        stop_top = Math.abs(parseInt(stop_top));
//        // 对当前高度值取余
//        var left_height = item_outer_height - stop_top % item_outer_height;
//        // 剩下的尺寸
//        var left_distance = left_height + left_center_top;
//        // 最终停下来的所在高度
//        var end_top = stop_top + left_distance;
//        // 最终定位到第几个对话框的索引
//        var sure_index = Math.floor((end_top + item_height % 2) / item_height) + 1;

        /*-------- 随机数欺骗停止方案 --------*/
        // 获取当前总的抽奖框
        var lottery_size = $('#lottery-wrap .lottery-list').size();
        // 随机生成停止位置的索引
        var stop_index = Math.floor(Math.random() * (lottery_size - 4));

        // 将整个抽奖块移动到停止索引所在位置 top 值
        var stop_top = item_outer_height * stop_index;
//        $('#lottery-wrap').css('top', -stop_top);

        // 停止动画时要走的距离，即再走三个索引（即两个框+半个框的距离）
        var left_distance = Math.floor(item_outer_height*2 + (item_outer_height - item_height));
        var sure_index = stop_index + 4;

        // 移动到要到达的指定位置
        var lastStep = function() {
            time02 = nextFrame(function() {
                top -= 2;
                // moveDom.style.top = (-stop_top + top) + 'px';
                setTopStyle(moveDom, (-stop_top + top));
                if (-top <= left_distance) {
                    lastStep();
                } else {
                    cancelFrame(time02);
                    // 处理中奖后的相关样式效果
                    $('#lottery-wrap .lottery-list').eq(sure_index).addClass('sure-active');
                }
            });
        };
        lastStep();
        // 停止动画
        cancelFrame(timer);

        var person = $('#lottery-wrap .lottery-list').eq(sure_index).data();

        // 移动完剩下的尺度
        var top = 0;
        var time02 = null;
        // 最后的倒计时
        $('.stop-main').fadeIn();
//        $('#stop-time').fadeIn();
        var stop_time = setTimeout(function() {
            $('#stop-time').fadeIn();
            $('#stop-time').text('贰');
            $('#stop-time').fadeOut();
        }, 800);
        stop_time = setTimeout(function() {
            $('#stop-time').fadeIn();
            $('#stop-time').text('壹');
        }, 1600);
        stop_time = setTimeout(function() {
            $('#stop-time').fadeOut();
            clearTimeout(stop_time);
            $('.stop-main').hide();
        }, 2400);


        setTimeout(function() {
            btn.disabled = false;
            // $(".snow-canvas").snow();
            $('#lottery-result').modal('show');
            drawAward(person);

            greed(person.id);

            can_stop = true;
            clearTimeout(arguments.callee);

            // 清除当前的定时任务
//            isStart = false;
//            isMove = true;
//            lottery_btn.text('开始抽奖');
//            lottery_btn.css('background', 'none');
        }, 4200);
    }

    // canvas 绘制中奖结果
    function drawAward(person) {
        var canvasEle = document.getElementById('lottery-canvas');
        canvasEle.querySelector('.avatar-image').style.backgroundImage = `./img/avatar/${person.filename}`;
        canvasEle.querySelector('.avatar-name').innerText = person.name;
    }

    $(function(){

        justGo(isMove);

        // 关闭中奖后弹出的 modal
        $('#modal-close').click(function() {
            if (!can_stop) {
                console.error('还没结束，无法重开！');
                return false;
            }
            $('#lottery-result').modal('hide');
        });

        // 音乐开关
        var music_local = local_handle.get('music') ? true : false;
        var music_config = {
            music: document.getElementById('music'),
            music_bool: (music_local == '1'),
            init: function() {
                if (this.music_bool) {
                    this.play();
                } else {
                    this.pause();
                }
            },
            play: function() {
                this.music.play();
                $('#music-control').addClass('animated infinite bounce');
                local_handle.set('music', 1);
                this.music_bool = true
            },
            pause: function() {
                this.music.pause();
                $('#music-control').removeClass('animated infinite bounce');
                local_handle.set('music', 0);
                this.music_bool = false;
            }
        };
        music_config.init();
        $('#music-control').click(function () {
            if (music_config.music_bool) {
                music_config.pause()
            } else {
                music_config.play();
            }
        });

        // 清除数据开关
        $('#clear-control').click(function () {
            var sure = confirm('警告：确定清除所有数据？！');
            if (sure) {
                local_handle.clear();
                window.location.reload();
            }
        });


        // 开始抽奖按钮
        lottery_btn.click(function () {
            var cur_lottery = $('#lottery-btn').data('award');

            // 当本轮抽奖结束后，抽奖将会进入短暂休眠期，此时将不会响应抽奖行为
            if (!isStart && !isMove) {
                console.log('本轮已结束');
                window.location.reload();
                return false;
            }

            if (!isStart && isMove) {
                startLottery();
            } else if(isStart) {
                stopLottery();
            }
        });

        // 执行空格键操作，等价于执行 “抽奖按钮点击” 操作
        $(document).keypress(function (e) {
            if (e.keyCode == 32) {
                lottery_btn.click();
            }

            // delete按键
            if (e.keyCode == 46) {
                $('#clear-control').click();
            }
        });

    });
}

function greed(id) {
    if(id) { // 有ID记录获奖者，并移除列表
        let greedList = local_handle.get('greed');
        if(!Array.isArray(greedList)){
            greedList = local_handle.set('greed', []);
        }

        greedList.push(id);
        local_handle.set('greed', greedList);
        $(`[data-id=${id}]`).remove();
        window.lottery_datas = window.lottery_datas.filter(item => item.id != id)
    }else{
        // 获取已经保存的列表
        return local_handle.get('greed') || [];
    }
}


start().catch(err => {
    throw err;
})

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {Array}      The first item in the shuffled array
 */
function shuffle (_array) {
    var array = [].concat(_array);
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

};


function sleep(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}
