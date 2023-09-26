export const catchErrorFunc =(fs)=>  (req,res,next)=>{
    Promise.resolve(fs(req,res,next))
    .catch(next)
}