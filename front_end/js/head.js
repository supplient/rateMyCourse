function jumpLogin(){
  //var tmp = window.sessionStorage.getItem("status");
  window.location.href = "./login.html";
  
}

function jumpSignUp(){
  window.location.href = "./signup.html";
}

function jumpPersonalInfo(){
  window.location.href = "./personalinfo.html";
}

function jumpLogOut(){
  
  $.ajax({
    async: false,
    type:"POST",
    url: "http://testapi.ratemycourse.tk/logout/",
    dataType:"json",
    data:{
      username: $.cookie("username")
    },
    xhrFields: {
      withCredentials: true
    },
    success:function(data){
      //data=JSON.parse(data);
      //console.log("status "+data.status);
      if (data.status > 0 ){
          $.cookie("username",undefined);
          $.removeCookie("username",{ path: '/'});
          alert("注销成功");
          window.setTimeout("location.href='./index.html'", 500);
      }
      else{
        $.cookie("username",undefined);
        $.removeCookie("username",{ path: '/'});
        alert("注销成功");
        window.setTimeout("location.href='./index.html'", 500);
        //alert("注销失败");
      }
    },
    error:function(data){
      alert("注销失败");
    }
  });
  
}