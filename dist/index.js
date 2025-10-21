import app from "./app.js";
import http from "http";
import { AppDataSource } from "./db.js";
import { initSocket } from "./sockets/sockets.js";
async function main() {
    try {
        await AppDataSource.initialize();
        const server = http.createServer(app);
        initSocket(server);
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log("Server on port", PORT);
        });
    }
    catch (error) {
        console.error(error);
    }
}
main();
//# sourceMappingURL=index.js.map