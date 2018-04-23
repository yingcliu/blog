/**
 * Created by lyingc on 2018/4/18.
 */

$(function() {
    // 退出
    $('#logout').on('click', function() {
        $.ajax({
            url: '/api/user/logout',
            success: function(res) {
                if (!res.code) {
                    window.location.replace('/');
                }
            }
        })
    })
});