const userObj = require('../model/User');

const stats = async (request, response)=>{
    try{
        const count = await userObj.countDocuments();
        return response.status(200).json({
            success: true,
            data: {
                totalUsers: count,
                totalPosts: 100,
                activeUsers: count,
                postsThisMonth: 10
            }
        });

    } catch(e){
        return response.status(500).json({
            success: false,
            message: "Error in fetching data"
        });
    }
}

module.exports = stats;