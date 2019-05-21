//处理所有的参数，数据

module.exports = (req,res,next) => {
  //授权业务
  
  //参数，数据整合业务
  
  //处理公共数据
  req.query._page = req.query._page ? req.query._page-1 : 0;//默认页数1
  req.query._limit = req.query._limit ? req.query._limit - 0 :10;//默认限定3条
  req.query.q = req.query.q ? req.query.q : '';//全文搜索
  req.query._sort = req.query._sort ? req.query._sort : '';//排序规则
  

  req.body._page = req.body._page ? req.body._page - 1 : 0
  req.body._limit = req.body._limit ? req.body._limit - 0 : 10
  req.body.q = req.body.q ? req.body.q : '';
  req.body._sort = req.body._sort ? req.body._sort : '';

  //处理 app 的 参数    api/home/1/commons/2
  req.rootParams=req.params[0].split('/')[0];//抓取根参数

  next();
}