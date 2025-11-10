module.exports = function(allowedRoles = []){
    return function(req, res, next){
      if(!req.user) return res.status(401).json({msg:'No user'});
      if(!allowedRoles.includes(req.user.role)) return res.status(403).json({msg:'Forbidden'});
      next();
    }
  }
  