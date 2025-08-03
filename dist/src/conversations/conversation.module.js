"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const conversation_service_1 = require("./conversation.service");
const conversation_controller_1 = require("./conversation.controller");
const conversation_schema_1 = require("./conversation.schema");
const user_schema_1 = require("../user/user.schema");
const message_schema_1 = require("../message/message.schema");
let ConversationModule = class ConversationModule {
};
exports.ConversationModule = ConversationModule;
exports.ConversationModule = ConversationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: conversation_schema_1.Conversation.name, schema: conversation_schema_1.ConversationSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: message_schema_1.Message.name, schema: message_schema_1.MessageSchema },
            ]),
        ],
        controllers: [conversation_controller_1.ConversationController],
        providers: [conversation_service_1.ConversationService],
        exports: [conversation_service_1.ConversationService],
    })
], ConversationModule);
//# sourceMappingURL=conversation.module.js.map