
export const Errors = (err,req,res,next) => {
     err.errorStatus = err.status || 500
     err.errorMessage = err.message || 'something went wrong'

    //handling casting error
    if(err.name==='CastError'){
        err.errorMessage = `product not found id wrong, invalid ${err.path}`
        err.status = 400
    }

    //handling duplicate key error
    if(err.code === 11000){
        err.errorMessage = `${Object.keys(err.keyValue)} already in use. Please enter new email.`
        err.status = 400
    }
    //jsonwebtoken expires or wrong
    if(err.name==='JsonWebTokenError'){
        err.errorMessage = `wrong json web token. or json web token expires.`
        err.status = 400
    }

    return res.status(err.errorStatus).send({
        success:false,
        message:err.errorMessage})
}