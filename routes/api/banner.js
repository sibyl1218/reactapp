let express = require('express');
let router = express.Router();
let mgdb = require('../../common/mgdb');
let pathLib = require('path')
let fs = require('fs');

//查询
router.get('/', (req, res, next) => {
  console.log('/api/banner 查询多条', req.query)

  let { _page, _limit, _sort, q, id } = req.query;

  if (!id) {
    console.log(1, id, _page, _limit, _sort, q)
    mgdb({
      collection: 'banner'
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
      collection: 'banner'
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
  console.log('/api/banner 查询一条', req.params, req.query)
  let id = req.params.id;
  // console.log(1,typeof id)
  if (!id) {
    res.send({ error: 1, msg: 'id为必传参数' })
  }

  mgdb({
    collection: 'banner'
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

//添加 
// router.post('/', (req, res, next) => {

//   let { content, title, sub_title, auth } = req.body;//拆除body数据
//   let time = Date.now();//创建服务器上传时间

//   //multer多图片循环，找到
//   let icon, banner;
//   req.files.forEach((file, index) => {
//     //抓取到对应图片
//     if (file.fieldname === 'icon') {
//       icon = require('../../config/path').user.uploadUrl + file.filename + pathLib.parse(file.originalname).ext;
//     }
//     if (file.fieldname === 'banner') {
//       banner = require('../../config/path').banner.uploadUrl + file.filename + pathLib.parse(file.originalname).ext;
//     }
//     fs.renameSync(//本地图片命名
//       file.path,
//       file.path + pathLib.parse(file.originalname).ext
//     )
//   })
//   //未传图片处理
//   if (!banner) banner = require('../../config/path').normal;
//   if (!icon) icon = require('../../config/path').normal;


//   mgdb(
//     {
//       collection: 'banner'
//     },
//     ({ collection, client }) => {
//       collection.insertOne(
//         { title, sub_title, banner, time, detail: { icon, auth, content } }
//         ,
//         (err, result) => {
//           if (!err && result.result.ok) {
//             res.send({ error: 0, msg: '成功', data: { id: result.insertedId, title, sub_title, banner, time, detail: { icon, auth, content } } })
//           } else {
//             res.send({ error: 1, msg: '添加失败' })
//           }
//           client.close();
//         }
//       )
//     }
//   );
// })

//删 
router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  if (!id) {
    res.send({ error: 1, msg: 'id为必传参数' })
  }

  mgdb({
    collection: 'banner'
  }, ({ collection, client, ObjectID }) => {
    collection.deleteOne({
      _id: ObjectID(id)
    },((err, result) => {
      // console.log(result.result.n);// 添加条件 > 0
      if(result.result.n>0){
        res.send({error:0,msg:'删除成功'})
      }else{
        res.send({error:1,msg:'删除失败'})
      }
      client.close();//关闭连接
    }))
  })
})

//改
router.put('/:id', (req, res, next) => {
  let id = req.params.id;
  if (!id) {
    res.send({ error: 1, msg: 'id为必传参数' })
  }

  mgdb({
    collection: 'banner'
  }, ({ collection, client, ObjectID }) => {
    collection.find({
      _id: ObjectID(id)
    }, {
        projection: { _id: 0 }//显示的key 
      }).toArray((err, result) => {

        // result[0];//原始库数据
        let {title,sub_title,auth,content} = req.body;
        title = title || result[0].title;
        sub_title = sub_title || result[0].sub_title;
        auth = auth || result[0].auth;
        content = content || result[0].content;


        //multer多图片循环，找到
        let icon, banner;
        req.files.forEach((file, index) => {
          //抓取到对应图片
          if (file.fieldname === 'icon') {
            icon = require('../../config/path').user.uploadUrl + file.filename + pathLib.parse(file.originalname).ext;
          }
          if (file.fieldname === 'banner') {
            banner = require('../../config/path').banner.uploadUrl + file.filename + pathLib.parse(file.originalname).ext;
          }
          fs.renameSync(//本地图片命名
            file.path,
            file.path + pathLib.parse(file.originalname).ext
          )
        })

        icon = icon || result[0].icon;
        banner = banner || result[0].banner;
        let time = Date.now();


        mgdb({
          collection: 'banner'
        }, ({ collection, client, ObjectID }) => {
          collection.updateMany({
            _id: ObjectID(id)
          },{
            $set:{
              title,sub_title,banner,time,detail:{icon,auth,content}
            }
          },{
            upsert:false, //插入
            projection:false //全局替换
          },((err, result) => {
            console.log(result.result.n);//成功条件 > 0
            console.log(result.modifiedCount);// 修改的条数

            if(result.result.n>0){
              res.send({error:0,msg:'成功'})
            }else{
              res.send({error:1,msg:'失败'})  
            }
            client.close();//关闭连接
          }))
        })
        
      })
  })
})

module.exports = router;