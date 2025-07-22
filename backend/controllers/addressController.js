import Address from "../models/Address.js";

//Add address: /api/address/add
export const addAddress = async(req,res)=>{
    try {
        const {address} = req.body;
        const userId = req.user.id;

        await Address.create({...address, userId})
        res.json({success:true, message:"Address added successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

//get address" : /api/address/get
export const getAddress = async(req,res)=>{
    try {
        const userId = req.user.id;
        const addresses = await Address.find({userId})

        res.json({success:true, addresses})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

// Delete address: /api/address/delete
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const {addressId }= req.body;
        const address = await Address.findOneAndDelete({ _id: addressId, userId });

        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found or unauthorized" });
        }

        res.json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Failed to delete address" });
    }
};
