// 评论图片功能
$(".imgUpload #imgUpload_btn_upload").click(function() {
    $(".imgUpload #imgUpload_btn_file").click();
});

$(".imgUpload #imgUpload_btn_clear").click(function() {
    $(".imgUpload #imgUpload_img").attr('src', '');
    $(".imgUpload #imgUpload_img").hide();
    $('.joe_comment__respond-form .body .text').show();
    $(".imgUpload #imgUpload_btn_file").val('');
    $(".joe_comment__respond-form .body textarea[name='text']").val('');
});

$(".imgUpload #imgUpload_btn_file").change(function() {
    var gs = this.files[0].name.split(".").pop().toLowerCase();
    if (gs!="jpg" && gs!="png" && gs!="gif") {
        alert("请上传.jpg，.png，.gif格式文件"); 
        return false;
    }
    //预览图片编码并显示
    var reader = new FileReader();
    reader.onloadend = function(e) {
        dealImage(e.target.result, 200, function(compressImg) {
            $(".imgUpload #imgUpload_img").attr('src', compressImg);
            $(".joe_comment__respond-form .body textarea[name='text']").val('{!{' + compressImg + '}!} ');
            $(".imgUpload #imgUpload_img").show();
            $('.joe_comment__respond-form .body .text').hide();
        });
    }
    reader.readAsDataURL(this.files[0]);
});


/**
 * 压缩图片 
 */
function dealImage(base64, w, callback) {
    var newImage = new Image()
    //压缩系数0-1之间
    var quality = 0.6;
    newImage.src = base64;
    newImage.setAttribute('crossOrigin', 'Anonymous');    //url为外域时需要
    var imgWidth, imgHeight;
    var ba = null;
    newImage.onload = function () {
        imgWidth = this.width;
        imgHeight = this.height;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        if (Math.max(imgWidth, imgHeight) > w) {
            if (imgWidth > imgHeight) {
                canvas.width = w;
                canvas.height = w * imgHeight / imgWidth;
            } else {
                canvas.height = w;
                canvas.width = w * imgWidth / imgHeight;
            }
        } else {
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            quality = 0.6;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
        while (base64.length / 1024 > 30) {
            quality -= 0.01;
            base64 = canvas.toDataURL("image/jpeg", quality);
        }
        // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
        while (base64.length / 1024 < 20) {
            quality += 0.001;
            base64 = canvas.toDataURL("image/jpeg", quality);
        }
        var ba = canvas.toDataURL('image/jpeg', quality); //压缩语句
        callback(ba);
    }
}