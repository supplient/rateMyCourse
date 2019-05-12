
function selectTeacher(name){
  $("#buttonSelectTeacher").html(name); 
}

function rank(number,id){
  $(id).raty({
    score:number,
    starOn:"./resource/star-on.png",
    starOff:"./resource/star-off.png",
    starHalf:"./resource/star-half.png",
    readOnly:false,
    halfShow:true,
    size:34,
 });
}

$(document).ready(function() {
  $.ajax({
    async: true,
    type: "GET",
    url: "http://testapi.ratemycourse.tk/getToken/",
    dataType: "json",
    xhrFields: {
        withCredentials: true
    },
    success: function (data) {
       $.cookie("csrftoken",data.token);
    },
    error: function (data) {
        console.log(JSON.stringify(data));
        alert(JSON.stringify(data));
    }
  });

  if($.cookie("username") != undefined){
    document.getElementById("signIn").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("personalInfo").style.display = "block";
    document.getElementById("logOut").style.display = "block"
  }
  //1 加载课程名称 学院
  var coursenum=parseInt(window.sessionStorage.getItem("coursetoload"));
  $("#course_name").html(window.sessionStorage.getItem("course"+coursenum+"name"));
  var teacher_list=window.sessionStorage.getItem("course"+coursenum+"teacher_list").split(',');
  //var teacher_list=["教师1"];
  var data="";
  for(var i=0; i<teacher_list.length;i++){
    data+="<li>\n"+
             "  <a class=\"dropdown-item\" herf=\"#\" onclick=\"selectTeacher($(this).text())\">"+teacher_list[i]+"</a>\n"+
             "</li>\n";
    console.log(teacher_list[i]);
    if(i<(teacher_list.length-1)){
      data+= "<div class=\"dropdown-divider\"></div>"
    }
    $("#teacherlist").html(data);
  }

  rank(5,"#difficulty_score");
  rank(5,"#funny_score");
  rank(5,"#gain_score");
  rank(5,"#recommend_score");

  //console.log($("#difficulty_score").raty("getScore"));

})

function Func_submit() {

  
  if ($.cookie("username") == undefined){
    alert("用户未登录！ 登录后即可发表评论");
    return false;
  }
  
  if($("#comment").val().length < 10){
    alert("评价内容至少需要10字");
	   return false
  }
  else if($("#comment").val().length > 2048){
    alert("评价内容不能多于2048字");
	   return false
  }
  else if($("#buttonSelectTeacher").text()=="选择教师"){
    alert("必须要选择任课教师");
    return false
  }

  var coursenum=parseInt(window.sessionStorage.getItem("coursetoload"));
  console.log(window.sessionStorage.getItem("course"+coursenum+"course_ID")+" "+$("#comment").val()+" "+$("#buttonSelectTeacher").text());
  var teacher=$("#buttonSelectTeacher").text();
  console.log(teacher);
  $.ajax({
      async: true,
      type: "POST",
      dataType: "json",
      url: "http://testapi.ratemycourse.tk/makeComment/",
      data: {
        username: $.cookie("username"),
        course_ID: window.sessionStorage.getItem("course"+coursenum+"course_ID"),
        content : $("#comment").val(),
        teacher_name : $("#buttonSelectTeacher").text(),
        csrfmiddlewaretoken:  $.cookie("csrftoken")
      },
      xhrFields: {
        withCredentials: true
      },
      success:function(data){
        //data=JSON.parse(data);
        //	alert("ajax success");
        //console.log(data);
        //console.log(data.status)
        if(data.status=="1"){
            //alert(data.body.message);
            //console.log("Successfully makeComment "+coursenum);
            //alert("评论成功！");
            console.log("评论发送成功");
            //window.setTimeout("location.href='./coursePage.html'", 1000);
        }
        else{
            console.log("评论发送失败");
            alert(data.errMsg);
        }  
      },
      error:function(data){
          alert(JSON.stringify(data));
      }
    });

    $.ajax({
      async: true,
      type: "POST",
      dataType: "json",
      url: "http://testapi.ratemycourse.tk/makeRank/",
      data: {
        username: $.cookie("username"),
        course_ID: window.sessionStorage.getItem("course"+coursenum+"course_ID"),
        difficulty_score: $("#difficulty_score").raty("getScore"),
        funny_score: $("#funny_score").raty("getScore"),
        gain_score: $("#gain_score").raty("getScore"),
        recommend_score: $("#recommend_score").raty("getScore"),
        csrfmiddlewaretoken:  $.cookie("csrftoken")
      },
      xhrFields: {
        withCredentials: true
      },
      success:function(data){
        //data=JSON.parse(data);
        //	alert("ajax success");
        //console.log(data);
        //console.log(data.status)
        if(data.status=="1"){
            //alert(data.body.message);
            //console.log("Successfully makeComment "+coursenum);
            alert("评论成功！");
            console.log("评分发送成功");
            window.setTimeout("location.href='./coursePage.html'", 1000);
        }
        else{
            console.log($("#difficulty_score").raty("getScore"));
            console.log("评分发送失败");
            alert(data.errMsg);
        }  
      },
      error:function(data){
          alert(JSON.stringify(data));
      }
    });
  
}
