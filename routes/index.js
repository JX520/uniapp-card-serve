var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var url = require('url');
var app = express();

var mongoose = require('mongoose');
var Product = require('../models/product.js');//产品表
var Share = require('../models/share.js');//动态表
var Require = require('../models/require.js');//需求表

var axios = require('axios');
var cors = require("cors");

//连接Mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/test', {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
	console.log('mongoose connected success!')
});

mongoose.connection.on('error', () => {
	console.log('mongoose connected fail!')
});

router.use(bodyParser.urlencoded({
	extended: false
}));
router.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(cors);

// router.all('*', function(req, res, next) { //设置跨域访问
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
// 	res.header("X-Powered-By", ' 3.2.1');
// 	res.header("Content-Type", "application/json;charset=utf-8");
// 	next();
// });
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

//查询产品
router.get('/product', (req, res, next) => {
	var {pathname,query} = url.parse(req.url,true);
	// console.log(query.uid);
	var uid = query.uid;
	Product.find({},(err,doc)=>{
		if (err) {
			res.json({
				code: 1,
				msg: '查询产品失败',
				result: err
			})
		} else {
			if(query.uid == "undefined" || query.uid == null){
				 return res.json(doc);
			}else{
				Product.findOne({uid:uid},(findErr,findDoc)=>{
					if(findErr){
						res.json({
							code: 1,
							msg: '查询产品失败',
							result: err
						})
					}else{
						res.json(findDoc);
						// console.log(findDoc);
					}
				})
				
			}
		}
	})
});

//获取动态
router.get('/share',(req,res,next)=>{
	var {pathname,query} = url.parse(req.url,true);
	var uid = query.uid;
	Share.find({},(err,doc)=>{
		if (err) {
			return res.json({
				code: 1,
				msg: '查询动态失败',
				result: err
			})
		} else {
			if(query.uid == "undefined" || query.uid == null){
				 return res.json(doc);
			}else{
				//查询单个数据		
				Share.findOne({uid:uid},(findErr,findDoc)=>{
					if(findErr){
						return res.json({
							code: 1,
							msg: '查询动态失败',
							result: err
						})
					}else{
						//改变点赞状态
						if(query.flag == 1){
							findDoc.isNice = !findDoc.isNice;
							if(findDoc.isNice){
								findDoc.niceNum +=1
							}else{
								findDoc.niceNum -=1
							}
							findDoc.save((saveErr,saveDoc)=>{
								
							})
							
						}
						
						//增加评论
						else if(query.flag == 2){
							var review = {
								'avatarUrl':query.avatarUrl,
								'nickName':query.nickName,
								'content':query.content,
								'publishTime':query.publishTime
							}

							Share.updateOne({uid:uid},{'$push':{review:review}},(reviewErr,reviewDoc)=>{
								if(reviewErr){
									console.log(reviewErr)
								}else{
									console.log(reviewDoc)
								}
							})
						}
						
						
						res.json(findDoc);
						// console.log(findDoc);
					}
				})
				
				
			}
		}
	})
})

//需求
router.post('/require',(req,res,next)=>{
	console.log(req.body);
	//查询需求
	if(req.body.type == '1'){
		var openid = req.body.openid;
		Require.find({openid:openid},(listErr,listDoc)=>{
			if (listErr) {
				return res.json({
					code: 1,
					msg: '查询需求失败',
					result: listErr
				})
			} else {
				res.json({
					code: 0,
					msg: '查询需求成功',
					result: listDoc
				})
			}
		})
	}
	//新增需求
	else{
		Require.create(req.body,(err,doc)=>{
			if (err) {
				return res.json({
					code: 1,
					msg: '保存需求失败',
					result: err
				})
			} else {
				res.json({
					code: 0,
					msg: '保存需求成功',
					result: doc
				})
			}
		});
	}
	
})

// router.get('/getUser',(req,res,next)=>{
// 	var {pathname,query} = url.parse(req.url,true);
// 	var userData = '';
// 	console.log(query.js_code);
// 	var data = {
// 		appid:"wxddfdc0207f9685cc",
// 		secret:"46c39d9ef7186ded35c917314b298070",
// 		js_code:query.js_code,
// 		grant_type:"authorization_code",
// 	};
// 	axios.get("https://api.weixin.qq.com/sns/jscode2session?appid=wxddfdc0207f9685cc&secret=46c39d9ef7186ded35c917314b298070&js_code=" + query.js_code + "&grant_type=authorization_code",).then(userData => {
// 		console.log(userData.data);
// 		userData = userData.data;
// 	});
// 	res.json(userData)
// });







module.exports = router;
