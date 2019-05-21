let express = require('express');
let router = express.Router();
let mgdb = require('../../common/mgdb');

router.get('/', (req, res, next) => {
  // console.log('/api/login',req.query,req.body)
  let { username, password } = req.query;

  mgdb({
    collection: "user"
  }, ({ collection, client }) => {
    collection.find({
      username,
      password
    }, {
        projection: { _id: 0, username: 0, password: 0 }
      }).toArray((err, result) => {
        if (!err) {
          if (result.length > 0) {
            //种cookie
            // req.session['user']=username + _id
            req.session['login'] = username;
            res.send({ error: 0, msg: '登录成功', data: result[0] })
          } else {
            res.send({ error: 1, msg: '用户名或者密码有误' })
          }
        } else {
          res.send({ error: 1, msg: '库操作失败' })
        }
        client.close();
      })
  })

})

module.exports = router;