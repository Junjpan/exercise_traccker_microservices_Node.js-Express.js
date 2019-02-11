let express=require('express');
let bodyParser=require('body-parser');
let path=require('path');
let mongoose=require('mongoose');
let moment=require('moment');

let app=express();
let User=require('./modules/user.js');
let Exercise=require('./modules/exercise.js');

mongoose.connect("mongodb://localhost:27017/exercisetracker");
let db=mongoose.connection;

db.once("open",()=>{
console.log("connected to Mongodb.");
})
db.on("error",function(err){
    console.log(err);
})
  

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));


app.set("views",path.join(__dirname+"/views"))
app.set("view engine","pug");


app.get('/',(req,res)=>{
res.render("login");
})

app.post('/',(req,res)=>{
 var user=req.body.username;
 var id=req.body.userid;
 var query={
     username:user,
     userid:id
 }
 User.find(query,(err,data)=>{
     console.log(data);
    if(err){res.send(err)}
    else if (data[0]) {
      res.redirect('/login/'+id)//go to enter exercisetracker page
     }else{
         res.render("nouser");
     } 
 })  
})

app.get('/api/exercise/new-user',(req,res)=>{  
res.render('newUser')  
})

app.post('/user/add/',(req,res)=>{  
 var userName=req.body.username;
 var length=userName.length;
 var userId=Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,5);//receive random ID
var user=new User();
user.username=userName;
user.userid=userId;
var query={username:userName}
if(userName.length>=8){
User.find(query,(err,data)=>{
    //console.log(data);
if(data[0]){
    res.render("repeatUser")
}else{
    user.save((err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render("userid",{
                username:userName,
                userid:userId
            })
        }
    })
}

})
} else{
    res.render("newUser",{
        message:"*Please Make sure you enter more than 8 character in the field."
    })
}
})

app.get('/login/:userid',(req,res,next)=>{
    var userid=req.params.userid;
    User.find({userid:userid},(err,data)=>{
        var login_username=data[0].username;
        //console.log(login_username);
        res.render("tracker",{
            username:"User: "+login_username,
            userid:userid,
            message:"You are logged in."
        })
    })
    
})


app.post('/api/exercise/log',(req,res)=>{
 let userid=req.body.userid;
 let description=req.body.description;
 let date=req.body.date;
 //let date=moment(date).format('YYYY-MM-DD');
 let duration=Number(req.body.duration);
 let exercise=new Exercise();
 exercise.userid=userid;
 exercise.description=description;
 exercise.date=date;
 exercise.duration=duration;

 exercise.save((err,data)=>{
     if (err){console.log(err);}
     else{
         res.render("log",{
             log:exercise
         })
     }
 })
})

app.get('/api/exercise/search',(req,res)=>{
res.render('search')
})

app.post('/api/exercise/search',(req,res)=>{
    //console.log(req.body);
   let userid=req.body.userid;
   let date=req.body.date;
   let limit=req.body.duration;
res.redirect('/api/exercise/searchlog?userid='+userid+"&date="+date+"&limit="+limit)
})


app.get('/api/exercise/searchlog',(req,res)=>{
   var id=req.query.userid;
    var date=req.query.date;
    var limit=req.query.limit;
  var query;
if(date==''&&limit==''){
    query={userid:id}
}else if(date==""&&limit!==''){
    query={userid:id,
           duration:limit}          
}else if(date!==''&&limit==""){
    query={userid:id,
    date:date}
}else{
    query={
        userid:id,
        date:date,
        duration:limit 
    }
}
console.log(query);

   Exercise.find(query,(err,data)=>{
    if(data[0]){ 
    Exercise.find(query).count((err,count)=>{
        res.render("searchresult",{log:data,
                                   count:count}) 
        
    });}else{
        res.render("nouser")
    }    
   })
})

app.listen(3000,()=>{
 console.log('server started on port 3000');
})