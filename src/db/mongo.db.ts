import { Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../settings/config';
import { initCollections } from './collections';
 
export let client: MongoClient;
 
// Подключение к БД
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);
 
  try {
    await client.connect();
    await db.command({ ping: 1 });

     // Инициализируем коллекции из подключённой базы.
    initCollections(db);
    console.log('✅ Connected to the database');
    
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export const stopDb = async () => {
  if (!client) {
    throw new Error (`❌ No active client`)  
  }
  await client.close()

}