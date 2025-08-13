import app from './app.js';
import { config } from './config/index.js';
import { sequelize, syncModels } from './models/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    await syncModels(); 
    app.listen(config.port, () => console.log(`✅ Server on :${config.port}`));
  } catch (e) {
    console.error('❌ DB 초기화 실패:', e);
    process.exit(1);
  }
})();
