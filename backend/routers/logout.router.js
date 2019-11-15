const router = require('express').Router();

router.route('/').get(function(req, res) {
    res.send('<form method="POST" action="/logout"><button>POST</button></form>');
 
})

router.route('/').post(function(req, res) {
 return res.redirect('/');
})

module.exports = router;