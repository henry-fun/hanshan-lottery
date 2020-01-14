
//除chrome外，其他支持需要在服务器上运行才支持
if(!window.localStorage){
    alert('不支持localstorage，抽奖无法启动！');
}

// 处理 localstorage 中奖数据
var local_handle = {
    local_item: "lottery_datas",
    get: function( key ) {
        return window.localStorage.getItem( key ) || ''
    },

    set: function( key, val) {
        window.localStorage.setItem( key, val );
    },
    delete: function(datas, name) {
        var res = [];
        datas.forEach(function(val, index) {
            if (name != val.nameen) {
                res.push(val);
            }
        });
        var new_datas = JSON.stringify(res);
        this.set(this.local_item, new_datas);
        return res;
    },
    clear: function() {
        window.localStorage.clear()
    }
};

var award_log = null;
if (!local_handle.get("award_log")) {
    var award_log = window.localStorage.getItem('award_initial');
    award_log = JSON.parse(award_log);
} else {
    var award_log = window.localStorage.getItem('award_log');
    award_log = JSON.parse(award_log);
}


// ---------------- 加载、渲染 滚动抽奖信息数据 ------------
// 如果得不到数据，则从初始化数据中获取
if (!local_handle.get("lottery_datas")) {
    var lottery_storage = window.localStorage.getItem('lottery_initial');
} else {
    var lottery_storage = window.localStorage.getItem('lottery_datas');
}
var lottery_datas = JSON.parse(lottery_storage);

// 绘制候选名单
function drawList() {
    // 随机打乱名单序列 保证概率一致性
    var lottery_data = _.shuffle(lottery_datas);
    var lottery_size = lottery_data.length;
    var lottery_disp = [];
    if (lottery_size !== 0) {
        for (var i = 0; i < lottery_data.length; i++) {
            lottery_disp.push(lottery_data[i]);
        }
        if (lottery_disp.length < 4 * 2) {
            // 不足一屏：绘制一些防止不够滚动底部出现白屏
            var i = -1;
            while (lottery_disp.length < 4 * 2) {
                i += 1;
                if (i >= lottery_size) {
                    i = 0;
                }
                lottery_disp.push(lottery_data[i]);
            }
        } else {
            // 足够一屏：重复绘制前八个防止滚动底部出现白屏
            for (let i = 0; i < 8; i++) {
                lottery_disp.push(lottery_data[i]);
            }
        }
    }
    $('#lottery-wrap').html(_.template($('#lotterycon-tpl').html())({ data: lottery_disp }));
}
drawList();

// ---------------- 加载、渲染 滚动抽奖信息数据 ------------
if (local_handle.get("award_1")) {
    $('#award-01').show();
    var award1_storage = window.localStorage.getItem('award_1');
    var award1_datas = JSON.parse(award1_storage);
    award1_datas.forEach(function (val, key) {
        var award_tpl = $('#awardcon-tpl').html();
        var award_dom = substitute(award_tpl, val);
        $('#award-01 .win').append(award_dom)
    });
}
if (local_handle.get("award_2")) {
    $('#award-02').show();
    var award2_storage = window.localStorage.getItem('award_2');
    var award2_datas = JSON.parse(award2_storage);
    award2_datas.forEach(function (val, key) {
        var award_tpl = $('#awardcon-tpl').html();
        var award_dom = substitute(award_tpl, val);
        $('#award-02 .win').append(award_dom)
    });
}
if (local_handle.get("award_3")) {
    $('#award-03').show();
    var award3_storage = window.localStorage.getItem('award_3');
    var award3_datas = JSON.parse(award3_storage);
    award3_datas.forEach(function (val, key) {
        var award_tpl = $('#awardcon-tpl').html();
        var award_dom = substitute(award_tpl, val);
        $('#award-03 .win').append(award_dom)
    });
}
if (local_handle.get("award_4")) {
    $('#award04-toggle').css('display', 'inline-block');
    var award4_storage = window.localStorage.getItem('award_4');
    var award4_datas = JSON.parse(award4_storage);
    award4_datas.forEach(function (val, key) {
        var award_tpl = $('#awardcon-tpl').html();
        var award_dom = substitute(award_tpl, val);
        $('#award-04 .win').append(award_dom)
    });
}


// ---------------- 抽奖动画相关参数配置 ------------
var nextFrame = window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.msRequestAnimationFrame     ||
                function(callback) {
                    var currTime = + new Date,
                            delay = Math.max(1000/60, 1000/60 - (currTime - lastTime));
                    lastTime = currTime + delay;
                    return setTimeout(callback, delay);
                },
    cancelFrame = window.cancelAnimationFrame         ||
            window.webkitCancelAnimationFrame         ||
            window.webkitCancelRequestAnimationFrame  ||
            window.mozCancelRequestAnimationFrame     ||
            window.msCancelRequestAnimationFrame      ||
            clearTimeout,
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

// 嗯，just go ！
function justGo (isMove) {
    var moveDom = document.getElementById('lottery-wrap'),
        wrapDom = document.getElementById('lottery-main'),
        move_height = moveDom.offsetHeight,
        wrap_height = wrapDom.offsetHeight,
        loop_height = item_outer_height * lottery_datas.length,
        distance = 0;

    var justMove = function(flag) {
        timer = nextFrame(function() {
            distance += speed;
            if (distance >= loop_height) {
                distance = distance % loop_height
            }
            moveDom.style.top = (-distance) + 'px';
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
        speed = 50;
    }, 7000);
    setout_time = setTimeout(function () {
        speed = 90;
        $('#lottery-btn').text('可抽奖啦 @_@');
        // 当速度达到最终的设置峰值是，isLock 将会解锁，此时，才可以停止动画
        isLock = false;
        clearTimeout(setout_time);
    }, 9000);
}

// 结束抽奖
function stopLottery() {
    var moveDom = document.getElementById('lottery-wrap');

    // 当isLock 锁还没解锁时， 此时不能停止抽奖，将会抛出没结束的异常
    if (isLock) {
        console.log('还没结束，请稍等...');
        return;
    }
    isStart = false;
    isMove = false;
    speed = 8;

    /*-------- 手动停止的方案 --------*/
    // 得到当前所在高度值
    // var stop_top = $('#lottery-wrap').css('top');
    // // 将当前高度值转换为绝对正值
    // stop_top = Math.abs(parseInt(stop_top));
    // // 对当前高度值取余
    // var left_height = item_outer_height - stop_top % item_outer_height;
    // // 剩下的尺寸
    // var left_distance = left_height + left_center_top;
    // // 最终停下来的所在高度
    // var end_top = stop_top + left_distance;
    // // 最终定位到第几个对话框的索引
    // var sure_index = Math.floor((end_top + item_height % 2) / item_height) + 1;
    // // 为防止最后出现空白
    // $('#lottery-wrap').html($('#lottery-wrap').html() + $('#lottery-wrap').html());

    /*-------- 随机数欺骗停止方案 --------*/
    // 获取当前总的抽奖框
    var lottery_size = lottery_datas.length;
    // 随机生成停止位置的索引
    var stop_index = Math.floor(Math.random() * lottery_size);

    // 将整个抽奖块移动到停止索引所在位置 top 值
    var stop_top = item_outer_height * stop_index;
    // $('#lottery-wrap').css('top', -stop_top);

    // 停止动画时要走的距离，即再走三个索引（即两个框+半个框的距离）
    var left_distance = Math.floor(item_outer_height*2 + (item_outer_height - item_height));
    var sure_index = stop_index + 4;

    // 停止动画
    cancelFrame(timer);

    // 移动完剩下的尺度
    var time02 = null;
    var time = new Date().valueOf();

    // 移动到要到达的指定位置
    var lastStep = function() {
        time02 = nextFrame(function() {
            var top = -((new Date().valueOf() - time) / 3000) * left_distance;
            moveDom.style.top = (-stop_top + top) + 'px';
            if (-top <= left_distance) {
                lastStep();
            } else {
                cancelFrame(time02);
                // 处理中奖后的相关样式效果
                $('#lottery-wrap .lottery-list').eq(sure_index).addClass('sure-active');
                var award_tpl = $('#awardcon-tpl').html();
                var award_dom = substitute(award_tpl, award_tmp);
                $('#award-0'+award).show();
                if (award == 4) {
                    $('#award-123').hide();
                    $('#award-04').show();
                    $('#award04-toggle').css('display', 'inline-block');
                }
                $('#award-0'+award+' .win').append(award_dom);
            }
        });
    };
    lastStep();

    var award = $('#lottery-btn').data('award');
    var lottery_name_zh = $('#lottery-wrap .lottery-list').eq(sure_index).data('namezh');
    var lottery_name_en = $('#lottery-wrap .lottery-list').eq(sure_index).data('nameen');

    // 最后的倒计时
    $('.stop-main').fadeIn();
    // $('#stop-time').fadeIn();
    var stop_time = setTimeout(function() {
        $('#stop-time').fadeIn();
        $('#stop-time').text('贰');
        $('#stop-time').fadeOut();
    }, 1000);
    stop_time = setTimeout(function() {
        $('#stop-time').fadeIn();
        $('#stop-time').text('壹');
    }, 2000);
    stop_time = setTimeout(function() {
        $('#stop-time').fadeOut();
        clearTimeout(stop_time);
        $('.stop-main').hide();
    }, 2500);

    // 向 localstorage 中写入中奖人数据
    var local_award = local_handle.get('award_'+award);
    var award_tmp = null;
    if (local_award) {
        var award_datas = JSON.parse(local_award);
        award_tmp = {
            'nameen': lottery_name_en,
            'namezh': lottery_name_zh
        };
        award_datas.push(award_tmp);
        local_handle.set("award_"+award, JSON.stringify(award_datas));
    } else {
        var award_datas = [];
        award_tmp = {
            'nameen': lottery_name_en,
            'namezh': lottery_name_zh
        };
        award_datas.push(award_tmp);
        local_handle.set("award_"+award, JSON.stringify(award_datas));
    }
    // 写入上次抽中的奖项记录
    local_handle.set("award_history", award);

    // 删除已经中奖的人数据
    local_handle.delete(lottery_datas, lottery_name_en);
    // 该项奖项将减1
    award_log['award0'+award] -= 1;
    local_handle.set('award_log', JSON.stringify(award_log));

    // 绘制最后出现的中奖canvas图
    drawAward(award, lottery_name_zh, lottery_name_en);

    setTimeout(function() {
        // $(".snow-canvas").snow();
        $('#lottery-result').modal('show');
        drawAward(award, lottery_name_zh, lottery_name_en);

        can_stop = true;
        clearTimeout(arguments.callee);

        // 清除当前的定时任务
        // isStart = false;
        // isMove = true;
        // lottery_btn.text('开始抽奖');
        // lottery_btn.css('background', 'none');
    }, 4200);

}

// canvas 绘制中奖结果
function drawAward(award, name_zh, name_en, pic_format) {
    var canvas = document.getElementById('lottery-canvas');
    var context = canvas.getContext('2d');
    if (!pic_format) {
        pic_format = 'png';
    }
    canvas.width = 700;
    canvas.height = 1300;
    var back_img = new Image();
    var avatar = new Image();
    avatar.src = './img/avatar/'+name_en+'.jpg';
    back_img.src = './img/award_'+award+'.'+pic_format;
    back_img.onload = function() {
        context.drawImage(back_img, 0, 0);

        // 绘制圆形头像
        circleImg(context, avatar, 158, 178 , 200);

        context.fillStyle = '#D9AD61';
        context.font = "bold 6rem STKaiti";
        if (name_zh.length <= 2) {
            context.fillText(name_zh, 300, 1010);
        } else if (name_zh.length >= 3) {
            context.fillText(name_zh, 280, 1000);
        }
    };
}

function circleImg(ctx, img, x, y, r) {
    ctx.save();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
    ctx.restore();
}

// 简单的模板替换引擎
function substitute(str,o,regexp){
    return  str.replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
        return (o[name] === undefined) ? '' : o[name];
    });
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
    var music_local = (local_handle.get('music') == '') ? '1' : local_handle.get('music');
    var music_config = {
        music: document.getElementById('music'),
        music_bool: (music_local == '1'),
        init: function() {
            if (this.music_bool) {
                this.play();
            } else {
                this.music.pause();
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

    // 控制：显示/隐藏 抽奖名单和抽奖奖品显示
    if (local_handle.get("mingdan_toggle") == 1) {
        $('#mingdan-con').slideDown();
        $('#mingdan').hide();
    } else {
        $('#mingdan-con').hide();
        $('#mingdan').show();
    }
    if (local_handle.get("liwu_toggle") == 1) {
        $('#liwu-con').slideDown();
        $('#liwu').hide();
    } else {
        $('#liwu-con').hide();
        $('#liwu').show();
    }

    $('#mingdan').click(function () {
        $(this).fadeIn();
        $('#mingdan-con').slideDown(1000);
        local_handle.set("mingdan_toggle", 1);
    });
    $('#mingdan-title').click(function() {
        $('#mingdan-con').slideUp(1000);
        $('#mingdan').show();
        local_handle.set("mingdan_toggle", 0);
    });
    $('#liwu').click(function () {
        $(this).fadeOut();
        $('#liwu-con').slideDown(1000);
        local_handle.set("liwu_toggle", 1);
    });
    $('#liwu-title').click(function() {
        $('#liwu-con').slideUp(1000);
        $('#liwu').show();
        local_handle.set("liwu_toggle", 0);
    });

    // 控制：显示/隐藏纪念奖
    var award_history = local_handle.get('award_history');
    if (award_history == 4) {
        $('#award-04').show();
        $('#award-123').hide();
    }
    $('#award04-toggle').click(function() {
        if ($('#award-04').is(":hidden")) {
            $('#award-04').show();
        } else {
            $('#award-04').hide();
        }

        if ($('#award-123').is(":hidden")) {
            $('#award-123').show();
        } else {
            $('#award-123').hide();
        }
    });

    // 控制奖项的选择
    // 1: 一等奖
    // 2: 二等奖
    // 3: 三等奖
    // 4: 纪念奖
    var select_award = local_handle.get('select_award');
    if (select_award) {
        $('.award').eq(select_award-1).addClass('award-active');
        $('#lottery-btn').data('award', select_award);
    } else {
        $('.award').eq(3).addClass('award-active');
        $('#lottery-btn').data('award', 4);
    }
    $('.award').click(function () {
        if (isStart) {
            console.error('正在抽奖ing，不允许更改奖项设置哦 ^_^');
            return false;
        }
        local_handle.set('select_award', $(this).data('award'));
        $('#lottery-btn').data('award', $(this).data('award'));
        $(this).addClass(function () {
            return $(this).hasClass('award-active') ? false : 'award-active';
        }).siblings('.award').removeClass('award-active')
    });

    // 开始抽奖按钮
    lottery_btn.click(function () {
        var cur_lottery = $('#lottery-btn').data('award');
        if (!cur_lottery) {
            alert('请先设置好奖项再抽奖哦 ^_^');
            return;
        }

        if (award_log['award0'+cur_lottery] <= 0) {
            alert('该奖项已经抽完啦，请选择其它奖项哦 ^_^！');
            return;
        }

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
        // 一、二、三、纪念奖
        if (e.keyCode == 49) {
            $('#award-1').click();
        }
        if (e.keyCode == 50) {
            $('#award-2').click();
        }
        if (e.keyCode == 51) {
            $('#award-3').click();
        }
        if (e.keyCode == 52) {
            $('#award-4').click();
        }
        // Enter 按键
        if (e.keyCode == 13) {
            $('#modal-close').click();
        }
        // delete按键
        if (e.keyCode == 46) {
            $('#clear-control').click();
        }
    });

});
