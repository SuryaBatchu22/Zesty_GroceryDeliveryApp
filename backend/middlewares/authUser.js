import jwt from 'jsonwebtoken';

const authUser = async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.json({success:false, message: 'Not Authorized'})
    }

    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if(tokenDecode.id){
            req.user = tokenDecode //req.body is not available in get method, so used req.user
        }else{
            return res.json({success:false, message: 'Not Authorized'})
        }
        next();
    }catch(error){
        console.log('error',error.message)
        res.json({success:false, message:error.message})
    }
}

export default authUser;