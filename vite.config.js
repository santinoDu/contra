// vite.config.js
import path from "path";

export default {
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        }
    },
    base: 'contra',
    build: {
        outDir: 'contra'
    }
}
