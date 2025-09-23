"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class UserRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.user.delete({ where: { id } });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.findMany();
        });
    }
    findAllAsArray() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.findMany();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.findUnique({ where: { id } });
        });
    }
    // async create(data: Omit<User, "id">): Promise<User> {
    //   if (!data.password) {
    //     throw new Error("Le champ password est requis");
    //   }
    //   // Le mot de passe est déjà hashé par le middleware
    //   return this.prisma.user.create({ data });
    // }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!data.password) {
                throw new Error("Le champ password est requis");
            }
            try {
                return yield this.prisma.user.create({ data });
            }
            catch (error) {
                if (error.code === "P2002" && ((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes("email"))) {
                    throw new Error("Un utilisateur avec cet email existe déjà");
                }
                throw error; // on relance si ce n’est pas un doublon
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.update({ where: { id }, data });
        });
    }
}
exports.default = UserRepository;
