//Current version works vial the localhost

module.exports = {
    MongoURI: 'mongodb+srv://ParadiseTravel:saittravelagency20212021!@cluster0.s8jzi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
}

//Previous version to work via Heroku
//module.exports = {
//    MongoURI: 'mongodb+srv://' + process.env.DBLOGIN  + ':' + process.env.DBPASSWORD + '@cluster0.s8jzi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//}