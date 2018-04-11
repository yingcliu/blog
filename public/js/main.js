/**
 * Created by lyingc on 2018/4/9.
 */

$(function() {
    $registerBox = $('#registerBox');
    $loginBox = $('#loginBox');
    $userInfo = $('#userInfo');

    $registerBox.find('a').on('click', function() {
        $registerBox.hide();
        $loginBox.show();
    });

    $loginBox.find('a').on('click', function() {
        $loginBox.hide();
        $registerBox.show();
    });

    // 注册
    $registerBox.find('button').on('click', function() {
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            dataType: 'json',
            data: {
                username: $registerBox.find('input[name="username"]').val(),
                password: $registerBox.find('input[name="password"]').val(),
                repassword: $registerBox.find('input[name="repassword"]').val(),
            },
            success: function(res) {
                $registerBox.find('.warning').html(res.message);
                if (!res.code) {
                    setTimeout(function() {
                        $registerBox.hide();
                        $loginBox.show();
                    }, 1000)
                }
            }
        })
    });

    // 登录
    $loginBox.find('button').on('click', function() {
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            dataType: 'json',
            data: {
                username: $loginBox.find('input[name="username"]').val(),
                password: $loginBox.find('input[name="password"]').val(),
            },
            success: function(res) {
                $loginBox.find('.warning').html(res.message);
                if (!res.code) {
                    window.location.reload();
                }
            }
        })
    });

    // 退出
    $('#logout').on('click', function() {
        $.ajax({
            url: '/api/user/logout',
            success: function(res) {
                if (!res.code) {
                    window.location.reload();
                }
            }
        })
    })
});