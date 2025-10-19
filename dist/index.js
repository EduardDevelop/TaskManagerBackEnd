import app from "./app.js";
//import { PORT } from "./config.js";
import { AppDataSource } from "./db.js";
async function main() {
    try {
        await AppDataSource.initialize();
        app.listen(3000);
        console.log("Server on port", 3000);
    }
    catch (error) {
        console.error(error);
    }
}
main();
//# sourceMappingURL=index.js.map