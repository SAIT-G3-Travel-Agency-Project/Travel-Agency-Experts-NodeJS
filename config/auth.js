// Add to any route to protect it from logged out users
function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role){
            res.status(401)
            res.render('/')
        }
    next()
    }
}

// Redirects users who are logged in who try to access the page (Ex. register, login)
function loggedInRedirect (req, res, next) {
    if(req.isAuthenticated()){
        res.redirect('/')
    } else {
        next()
    }
}

// Passes user data globally so that we can use it
function userLoggedInCheck (req, res, next) {
    if (req.isAuthenticated()){
        role = req.user.role,
        first_name = req.user.name
    }
    next()    
}

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/login');
    },
    authRole,
    userLoggedInCheck,
    loggedInRedirect
}
    
