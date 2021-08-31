const genaratMassege = (username,text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
} 

ganerateLocation = (username,url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    genaratMassege,
    ganerateLocation,
    
}