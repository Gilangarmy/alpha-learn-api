const router = require("express").Router();
const verify = require('../routes/verifyUser')

router.get('/', verify, (req, res)=>{
    res.json({
        post :{
            title : 'project 1',
            description : 'isi deskripsi',
        }
    })
})

module.exports = router;