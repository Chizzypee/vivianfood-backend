// error middleware for error msg

exports.notFound = (_req, res, _next) => {
    const err = new Error("Route not Found");
    err.status = 404;
    res.status(err.status).json({error: err.massage});
}

// error middleware is use for an error middleware

exports.errorHandler = (err, req, res, _next) => {
    if(err.error){
        return res.status(err.status || 404).json({error: err.massage});
    }
    res.status(err.status || 500).json({error: err.massage || "unknown error occurred"})
}