"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModelCompiled = void 0;
const mongoose_1 = require("mongoose");
const ModelSchema = new mongoose_1.Schema({
    // <-- add `InstanceMethods` here
    name: String,
});
ModelSchema.statics.sMethod1 = function () {
    this.sMethod2('test');
};
ModelSchema.statics.sMethod2 = function () { };
ModelSchema.methods.iMethod1 = function () {
    this.iMethod2('test');
};
ModelSchema.methods.iMethod2 = function () { };
// create lazy connection object to connect later
const connection = (0, mongoose_1.createConnection)();
exports.TestModelCompiled = connection.model('testModel', ModelSchema);
const modelInstance = new exports.TestModelCompiled();
modelInstance.iMethod1('test');
exports.TestModelCompiled.sMethod1('test');
