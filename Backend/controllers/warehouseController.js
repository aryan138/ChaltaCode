const mongoose = require('mongoose');
const warehouse = require('../models/warehouse');

const minValAndSizeForUser = async(req,res)=>{
    try {
        const id = req.user._id;
        const {min_val,storage} = req.body;
        if(!min_val || !storage){
            return res.status(404).json({
                success:false,
                message:'all fields must be filled'
            });
        }
        const findWarehouse = await warehouse.findOneAndUpdate({owner:id},{
            min_quantity:min_val,
            storage:storage
        },{
            $new:true
        });
        if (findWarehouse){
            return res.status(200).json({
                success:true,
                message:'details updatd successfully',
                details:findWarehouse
            })
        }
        const createWarehouse = new warehouse(
            {
                min_quantity:min_val,
                storage:storage,
                owner:id
            }
        )
        await createWarehouse.save();
        if (!createWarehouse){
            return res.status(409).json({
                success:false,
                message:"error occured while saving warehouse details"
            })
        }
        return res.status(200).json({
            success:true,
            message:'sucessfully updated details',
            details:createWarehouse,
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"error occured while saving warehouse values"+error.message,
        })
    }
}
const minValAndSizeForAdmin = async(req,res)=>{
    try {
        const id = req.user._id;
        const {min_val,storage} = req.body;
        if(!min_val || !storage){
            return res.status(404).json({
                success:false,
                message:'all fields must be filled'
            });
        }
        const findWarehouse = await warehouse.findOneAndUpdate({owner:id},{
            min_quantity:min_val,
            storage:storage
        },{
            $new:true
        });
        if (findWarehouse){
            return res.status(200).json({
                success:true,
                message:'details updatd successfully',
                details:findWarehouse
            })
        }
        const createWarehouse = new warehouse(
            {
                min_quantity:min_val,
                storage:storage,
                owner:id
            }
        )
        await createWarehouse.save();
        if (!createWarehouse){
            return res.status(409).json({
                success:false,
                message:"error occured while saving warehouse details"
            })
        }
        return res.status(200).json({
            success:true,
            message:'sucessfully updated details',
            details:createWarehouse,
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"error occured while saving warehouse values"+error.message,
        })
    }
}

const getDetails = async(req,res)=>{
    try {
        const id = req.user._id;
        const findWarehouse = await warehouse.findOne({owner:id});
        if (!findWarehouse){
            return res.status(404).json({success:false, message:'please set you inventory size'});
        }
        res.status(200).json({success:true, message:"successfully retrieved data",details:findWarehouse});
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"error occured while retrieving warehouse values"+error.message,
        })
    }
}
const getDetailsForAdmin = async(req,res)=>{
    try {
        const id = req.user._id;
        const findWarehouse = await warehouse.findOne({owner:id});
        if (!findWarehouse){
            return res.status(404).json({success:false, message:'please set you inventory size'});
        }
        res.status(200).json({success:true, message:"successfully retrieved data",details:findWarehouse});
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"error occured while retrieving warehouse values"+error.message,
        })
    }
}

module.exports = {minValAndSizeForUser,minValAndSizeForAdmin,getDetails,getDetailsForAdmin}