//var $ = require('jQuery');


$(document).ready(function(){
    $("#dept_select").change(function(){
        var value = $('#dept_select').find(":selected").text();
        console.log(value);
        //$("p").hide();
        $.ajax({
            type: 'POST',
            url: '/donovan',
            data: value

        })
    });
});

