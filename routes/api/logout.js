let express = require('express');
let router = express.Router();
let mgdb = require('../../common/mgdb');

router.put('/',(req,res,next)=>{
  req.session.user = undefined;
  res.send({error:0,msg:'注销成功'})
})

module.exports = router;