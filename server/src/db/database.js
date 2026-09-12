import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db_store.json');

const defaultData = {
  customers: [],
  tickets: [],
  orders: [],
  payments: [],
  support_history: [],
  policies: [],
  investigations: [],
  ai_recommendations: [],
  escalations: [],
  audit_logs: []
};

class Database {
  constructor() {
    this.data = { ...defaultData };
    this.mongoClient = null;
    this.mongoDb = null;
    this.isMongoConnected = false;
    this.load();
    this.initMongoIfConfigured();
  }

  async initMongoIfConfigured() {
    const mongoUri = process.env.MONGODB_URI || process.env.ATLAS_URI;
    if (!mongoUri) return;

    try {
      console.log('Connecting to MongoDB Atlas Database...');
      this.mongoClient = new MongoClient(mongoUri);
      await this.mongoClient.connect();
      this.mongoDb = this.mongoClient.db(process.env.DB_NAME || 'resolveai_db');
      this.isMongoConnected = true;
      console.log('Successfully connected to MongoDB Atlas!');
    } catch (err) {
      console.error('Failed to connect to MongoDB Atlas, retaining local storage fallback:', err.message);
      this.isMongoConnected = false;
    }
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading database file, initializing fresh:', err);
      this.data = { ...defaultData };
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing database file:', err);
    }
  }

  getTable(tableName) {
    if (!this.data[tableName]) {
      this.data[tableName] = [];
    }
    return this.data[tableName];
  }

  find(tableName, predicate = () => true) {
    return this.getTable(tableName).filter(predicate);
  }

  findOne(tableName, predicate) {
    return this.getTable(tableName).find(predicate);
  }

  findById(tableName, id) {
    return this.getTable(tableName).find(item => item.id === id || item.ticket_id === id || item.customer_id === id);
  }

  insert(tableName, item) {
    const table = this.getTable(tableName);
    if (!item.id && !item.ticket_id) {
      item.id = `${tableName.slice(0, 3).toUpperCase()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
    item.created_at = item.created_at || new Date().toISOString();
    item.updated_at = new Date().toISOString();
    table.unshift(item);
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection(tableName).insertOne({ ...item }).catch(console.error);
    }

    return item;
  }

  update(tableName, predicate, updates) {
    const table = this.getTable(tableName);
    let updatedCount = 0;
    table.forEach(item => {
      if (predicate(item)) {
        Object.assign(item, updates, { updated_at: new Date().toISOString() });
        updatedCount++;
      }
    });
    if (updatedCount > 0) this.save();
    return updatedCount;
  }

  reset(newData) {
    this.data = JSON.parse(JSON.stringify(newData));
    this.save();
  }
}

export const db = new Database();
