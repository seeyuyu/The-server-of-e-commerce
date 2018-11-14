const router = require('koa-router')()
const categoryLabel= require('../public/json/categoryLabel.json')
router.get('/categoryLabel',async (ctx,next) =>{
    let self =ctx;
    // console.log("ctx.----------",self)
    self.body=categoryLabel;
})


module.exports = router
