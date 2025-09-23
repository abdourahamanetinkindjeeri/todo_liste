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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordHash = yield bcryptjs_1.default.hash("admin123", 10);
        const users = [
            {
                nom: "Diop",
                prenom: "Awa",
                email: "awa@exemple.com",
                password: passwordHash,
                role: client_1.Role.PROPRIETAIRE,
            },
            {
                nom: "Ndiaye",
                prenom: "Moussa",
                email: "moussa.ndiaye@exemple.com",
                password: passwordHash,
                role: client_1.Role.PROPRIETAIRE,
            },
            {
                nom: "Sarr",
                prenom: "Fatou",
                email: "fatou.sarr@exemple.com",
                password: passwordHash,
                role: client_1.Role.PROPRIETAIRE,
            },
            {
                nom: "Ba",
                prenom: "Amadou",
                email: "amadou.ba@exemple.com",
                password: passwordHash,
                role: client_1.Role.PROPRIETAIRE,
            },
        ];
        // Création des utilisateurs et récupération des IDs
        const createdUsers = [];
        for (const user of users) {
            const created = yield prisma.user.create({ data: user });
            createdUsers.push(created);
        }
        console.log("4 utilisateurs admin ajoutés !");
        // Répartition des tâches (2 par utilisateur)
        let taskIndex = 1;
        for (const user of createdUsers) {
            for (let i = 0; i < 2; i++) {
                yield prisma.todo.create({
                    data: {
                        libelle: `Tâche ${taskIndex}`,
                        description: `Description de la tâche ${taskIndex}`,
                        estAcheve: false,
                        userId: user.id,
                    },
                });
                taskIndex++;
            }
        }
        console.log("8 tâches ajoutées et associées aux utilisateurs !");
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => {
    prisma.$disconnect();
});
