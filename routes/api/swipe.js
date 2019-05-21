let express = require('express');
let router = express.Router();
let mgdb = require('../../common/mgdb');
let pathLib = require('path')
let fs = require('fs');

//查询
router.get('/', (req, res, next) => {
  console.log('/api/swipe 查询多条', req.query)

  let { _page, _limit, _sort, q, id } = req.query;

  if (!id) {
    console.log(1, id, _page, _limit, _sort, q)
    mgdb({
      collection: 'swipe'
    }, ({ collection, client }) => {
      collection.find(
        q ? { title: eval('/' + q + '/g') } : {},
        // q ? { title: new RegExp(q,'g') } : {},

        {
          sort: _sort ? { [_sort]: -1 } : { 'time': -1 }
          // projection:{_id:0}//显示的key 
        }).toArray((err, result) => {
          console.log(2, result)
          let checkResult = result.slice(_page * _limit, _page * _limit + _limit)
          console.log(3, checkResult)
          let page_count = Math.ceil(result.length / _limit)
          console.log(4, page_count)
          res.send({ error: 0, msg: '成功', page_count, data: checkResult })
          client.close();//关闭连接
        })
    })
  } else {
    mgdb({
      collection: 'swipe'
    }, ({ collection, client, ObjectID }) => {
      collection.find({
        _id: ObjectID(id)
      }, {
          projection: { _id: 0 }//显示的key 
        }).toArray((err, result) => {
          // console.log(result);//成功条件 result.length > 0
          if (result.length > 0) {
            res.send({ error: 0, msg: '成功', data: result[0] })
          } else {
            res.send({ error: 0, msg: "失败" })
          }
          client.close();//关闭连接
        })
    })
  }

})
router.get('/:id', (req, res, next) => {
  console.log('/api/swipe 查询一条', req.params, req.query)
  let id = req.params.id;
  // console.log(1,typeof id)
  if (!id) {
    res.send({ error: 1, msg: 'id为必传参数' })
  }

  mgdb({
    collection: 'swipe'
  }, ({ collection, client, ObjectID }) => {
    collection.find({
      _id: ObjectID(id)
    }, {
        projection: { _id: 0 }//显示的key 
      }).toArray((err, result) => {
        // console.log(result);//成功条件 result.length > 0
        if (result.length > 0) {
          res.send({ error: 0, msg: '成功', data: result[0] })
        } else {
          res.send({ error: 0, msg: "查无信息" })
        }
        client.close();//关闭连接
      })
  })
})

module.exports = router;