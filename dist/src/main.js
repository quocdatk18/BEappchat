"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const passport = require("passport");
const path_1 = require("path");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors({
        origin: '*',
    });
    app.use(passport.initialize());
    const uploadsPath = (0, path_1.join)(process.cwd(), 'uploads');
    app.use('/uploads', express.static(uploadsPath));
    await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
//# sourceMappingURL=main.js.map