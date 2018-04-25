/**
 * Created by lyingc on 2018/4/25.
 */
var prepage = 2;
var page = 1;
var comments = [];

function renderCommentList() {
    var list = comments;
    $('#commentNum').html(list.length);
    var html = '';
    if (list.length) {
        var pages = Math.ceil(list.length / prepage);
        var $pager = $('#pager');
        $pager.find('li').eq(1).html(page + '/' + pages);
        if (page <= 1) {
            page = 1;
            $pager.find('li').eq(0).html('<span>没有上一页了</span>');
        } else {
            $pager.find('li').eq(0).html('<a href="javascript:;"><span aria-hidden="true">&larr;</span> 上一页</a>');
        }
        if (page >= pages) {
            page = pages;
            $pager.find('li').eq(2).html('<span>没有下一页了</span>');
        } else {
            $pager.find('li').eq(2).html('<a href="javascript:;">下一页 <span aria-hidden="true">&rarr;</span></a>');
        }
        var start = (page - 1) * prepage;
        var end = Math.min(start + prepage, list.length);
        for (var i=start; i < end; i++) {
            html += '<li><h5>'+ list[i].username +'<span>'+ formatDate(list[i].postTime) +'</span></h5><p>'+ list[i].content +'</p></li>'
        }
    } else {
        html = '<li class="text-center">暂无评论</li>'
    }
    $('#commentList').html(html);
}

function formatDate(d) {
    var date = new Date(d);
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 '
        + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
$(function() {
    $('#pager').on('click', 'a', function() {
        if($(this).parent().hasClass('previous')) {
            page--;
        } else {
            page++;
        }
        renderCommentList();
    });
    $('#commentBtn').on('click', function() {
        var content = $('#commentContent').val();
        if (!content) {
            alert('评论不能为空');
            return;
        }
        $.ajax({
            type: 'post',
            url: '/api/comment/post',
            data: {
                contentId: $('#contentId').val(),
                content: content
            },
            success: function(res) {
                $('#commentContent').val('');
                comments = res.data.comments.reverse();
                renderCommentList();
            }
        })
    });

    $.ajax({
        url: '/api/comment',
        data: {
            contentId: $('#contentId').val()
        },
        success: function(res) {
            $('#commentContent').val('');
            comments = res.data.reverse();
            renderCommentList();
        }
    })
});