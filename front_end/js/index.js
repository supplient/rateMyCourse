//cookies
function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
}

  function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

function selectSchool(a) {
  document.getElementById("buttonSelectSchool").innerText=a;
}

function selectDepartment(a) {
  document.getElementById("buttonSelectDepartment").innerText=a;
}


function storedata(data){
//  setCookie("coursenum",data.length,0);
  window.sessionStorage.setItem("coursenum",data.length);
  for (var i=0;i<data.length;i++){
      /*setCookie("course"+i+"name",data.body[i].name,1);
      setCookie("course"+i+"website",data.body[i].website,1);
      setCookie("course"+i+"course_ID",data.body[i].course_ID,1);
      setCookie("course"+i+"course_type",data.body[i].course_type,1);
      setCookie("course"+i+"description",data.body[i].description,1);
      setCookie("course"+i+"credit",data.body[i].credit,1);
      console.log(getCookie("course"+i+"description"));
      console.log("course"+i+"description   "+data.body[i].description);
      setCookie("username","WTF???",365);
      console.log(getCookie("username"));
      var x=document.cookie;
      console.log(x);*/
      console.log("test DOM storage");
      if (window.sessionStorage) { 
          window.sessionStorage.setItem("course"+i+"name",data.body[i].name);
          window.sessionStorage.setItem("course"+i+"website",data.body[i].website);
          window.sessionStorage.setItem("course"+i+"course_ID",data.body[i].course_ID);
          window.sessionStorage.setItem("course"+i+"course_type",data.body[i].course_type);
          window.sessionStorage.setItem("course"+i+"description",data.body[i].description);
          window.sessionStorage.setItem("course"+i+"credit",data.body[i].credit);
          window.sessionStorage.setItem("course"+i+"department",data.body[i].department);
          //console.log(data.body[i].teacher_list);
          window.sessionStorage.setItem("course"+i+"teacher_list",data.body[i].teacher_list);
          console.log(window.sessionStorage.getItem("course"+i+"website"));
          //console.log("1111111"+window.sessionStorage.getItem("course"+i+"teacher_list"))
          if(i==0)
          console.log("1111222"+sessionStorage.getItem("course"+i+"teacher_list").split(","));
      }
  }
}







$(document).ready(function(){

  if ($.cookie("username") != undefined){
    document.getElementById("signIn").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("personalInfo").style.display = "block";
    document.getElementById("logOut").style.display = "block"
  } 
  
  $.ajax({
      type:"GET",
      url: "https://api.ratemycourse.tk/getDepartment/",
      dataType:"json",
      success:function(data){
        //	alert("ajax success");
          //console.log(data);
          //console.log(data.status)
          if(data.status=="1"){
              //alert(data.body.message);
              var data2="";
              for(var i=0; i<data.body.length;i++){
                data2+="<li>\n"+
                        "  <a class=\"dropdown-item\" herf=\"#\" onclick=\"selectDepartment($(this).text())\">"+data.body[i].name+"</a>\n"+
                        "</li>\n";
                //console.log(data.body[i]);
                if(i<(data.body.length-1)){
                  data2+= "<div class=\"dropdown-divider\"></div>"
                }
                $("#departments").html(data2);
              }
          }
          else{
            alert(data.errMsg);
          }
          
      },
      error:function(data){
        alert(JSON.stringify(data));
      }
  });


  function search(){
      
      var department=$("#buttonSelectDepartment").text();

      if (department=="选择学院"){
        //没有选择学院
          $.ajax({
              type:"GET",
              url: "https://api.ratemycourse.tk/searchCourse/",
              dataType:"json",
              data:{              
                  course_name: $("#searchboxCourse").val(),
              },
              success:function(data){
                //	alert("ajax success");
                  console.log(data);
                  //console.log(data.status)
                  if(data.status=="1"){
                      //alert(data.body.message);
                      console.log("Successfully searched");
                      storedata(data);
                      window.setTimeout("location.href='./searchResult.html'",0);
                  }
                  else{
                    alert(data.errMsg);
                  }
                  
              },
              error:function(data){
                alert(JSON.stringify(data));
              }
          });
      }
      else{
        //选择了学院
          $.ajax({
              type:"GET",
              url: "https://api.ratemycourse.tk/searchCourseByDepartment/",
              dataType:"json",
              data:{              
                  course_name: $("#searchboxCourse").val(),
                  department: $("#buttonSelectDepartment").text()
              },
              success:function(data){
                //	alert("ajax success");
                  console.log(data);
                  //console.log(data.status)
                  if(data.status=="1"){
                      //alert(data.body.message);
                      console.log("Successfully searched");
                      storedata(data);
                      window.setTimeout("location.href='./searchResult.html'",0);
                  }
                  else{
                    alert(data.errMsg);
                  }
                  
              },
              error:function(data){
                alert(JSON.stringify(data));
              }
          });
      }

      
  }
  $("#buttonSearchCourse").click(function(){
      search();
  });
  $("html").keydown(function (event) {
      if (event.keyCode == 13) {
          //enter to search
          search();
      }
      else if (event.keyCode == 113) {
          //F2 to add course
          for(var id=60;id<80;id++)
            addcourse(id);
      }
      else if (event.keyCode == 114) {
        //F3 to add  teach course
        
          addteachcourse(60);
    }
  });
});