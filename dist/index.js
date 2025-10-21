import app from "../src/app.js";
import { AppDataSource } from "../src/db.js";
let initialized = false;
export default async function handler(req, res) {
    if (!initialized) {
        await AppDataSource.initialize();
        initialized = true;
    }
    app(req, res); // delega a Express
}
//# sourceMappingURL=index.js.map