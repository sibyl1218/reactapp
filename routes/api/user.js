let express = require('express');
let router = express.Router();
let mgdb = require('../../common/mgdb');

//自动登录校验
router.get('/', (req, res, next) => {
  // console.log('/api/login',req.query,req.body)
  let { user } = req.session;
  console.log(1,user)
  if(!user){
    res.send({error:1,msg:"未登录"})
  }else{
    mgdb({
      collection: "user"
    }, ({ collection, client }) => {
      collection.find({
        username:user
      }, {
          projection: { _id: 0, username: 0, password: 0 }
        }).toArray((err, result) => {
          console.log(2,result)
          if (!err) {
            if (result.length > 0) {
              res.send({error:0, msg:"成功",data:result[0]})
            } else {
              res.send({ error: 0, msg: '查不到用户信息' })
            }
          } else {
            res.send({ error: 1, msg: '库操作失败' })
          }
          client.close();
        })
    })
  }

  

})
/* router.get('/:id',(req,res,next)=>{
  console.log('/api/user/id')
}) */

module.exports = router;