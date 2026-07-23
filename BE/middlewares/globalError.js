const errorMiddleware=(error,req,res,next)=>{

    console.log(error.stack)
    const errCode=error.statusCode ||500
    return res.status(errCode).json({
      status:errCode,
          message: error.message||"server error",
          errors:error.errors ? error.errors:null
        })
}
module.exports=errorMiddleware