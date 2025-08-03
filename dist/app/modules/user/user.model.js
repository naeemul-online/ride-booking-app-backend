"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, { versionKey: false, _id: false });
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.rider,
    },
    status: {
        type: String,
        enum: Object.values(user_interface_1.IStatus),
        default: user_interface_1.IStatus.active,
    },
    auths: [authProviderSchema],
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
