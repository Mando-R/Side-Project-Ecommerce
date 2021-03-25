// ensureAuthenticated(req)：封裝 passport 提供的 req.isAuthenticated()
function ensureAuthenticated(req) {
  // req.isAuthenticated()：檢查 request 是否登入
  return req.isAuthenticated()
}
// getUser(req)：封裝 passport 提供的 req.user
function getUser(req) {
  // req.user：取得 當下登入的 User
  return req.user
}

module.exports = {
  ensureAuthenticated,
  getUser,
}