let express = require('express');
let router = express.Router();
let mgdb = require('../../common/mgdb');
let pathLib = require('path');
let fs = require('fs');

router.post('/', (req, res, next) => {
  // console.log('/api/login',req.query,req.body)
  let { username, password } = req.body;

  multer上传图片,需要解决没有上传头像
  let icon = req.files.length ? require('../../config/path').user.uploadUrl + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext : '';
  if(icon){
    console.log(1.5,icon)
    fs.renameSync(
      req.files[0].path,
      req.files[0].path + pathLib.parse(req.files[0].originalname).ext
    )
  }else{
    icon = require('../../config/path').normal
  }


  let time = Date.now();
  let guanzhu=0;
  let fensi=0;
  let nikename=username;
  let lvji={title:'萌新之家',quwen:'快去旅行吧'}

  //校验username/password的合法性
  mgdb({
    collection: "user"
  }, ({ collection, client }) => {
    collection.find({
      username
    }, {
        projection: { _id: 0, username: 0, password: 0 }
      }).toArray((err, result) => {
        if (!err) {
          if (result.length > 0) {
            res.send({ error:1, msg: '用户名已存在' })
            client.close();
          } else {
            // 写库

            collection.insertOne({
              username,password,guanzhu,fensi,nikename,lvji,time
            },(err,result)=>{
              if(result.result.ok>0){
                res.send({ error: 0, msg: '注册成功', data: result.ops })
              }else{
                res.send({ error:1, msg: '注册失败' })
              }
              client.close();
            })
            
          }
        } else {
          res.send({ error: 1, msg: '库操作失败' })
          client.close();
        }
        
      })
  })
})
module.exports = router;