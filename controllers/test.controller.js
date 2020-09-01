function TestController() {
  
}

TestController.prototype.test = function(req, res) {
  res.json({status: 'ok'});
};

module.exports = TestController;