"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const diver_interface_1 = require("./diver.interface");
const driverSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    licenseNumber: { type: String, required: true, unique: true },
    vehicleInfo: {
        type: { type: String, required: true },
        model: { type: String, required: true },
        plateNumber: { type: String, required: true },
    },
    approvalStatus: {
        type: String,
        enum: Object.values(diver_interface_1.IApprovalStatus),
        default: diver_interface_1.IApprovalStatus.pending,
    },
    isOnline: { type: Boolean, default: false },
    location: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
    },
    earnings: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
}, {
    timestamps: true,
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
