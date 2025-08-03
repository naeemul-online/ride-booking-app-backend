"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["super_admin"] = "super_admin";
    Role["admin"] = "admin";
    Role["rider"] = "rider";
    Role["driver"] = "driver";
})(Role || (exports.Role = Role = {}));
var IStatus;
(function (IStatus) {
    IStatus["active"] = "active";
    IStatus["blocked"] = "blocked";
})(IStatus || (exports.IStatus = IStatus = {}));
