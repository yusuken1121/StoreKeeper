import { app } from "./app";
import { ENV, PORT } from "./env";

app.listen(PORT, () => {
  console.log(`[server]: listening at http://localhost:${PORT} in ${ENV} mode`);
});
