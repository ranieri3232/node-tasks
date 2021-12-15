import { createConnection } from 'typeorm';

export async function connect() {
  const conn = await createConnection();
  if (conn) {
    console.log('📦 succesffuly connected to node-tasks database.');
  } else {
    console.log('❌ cannot connect to node-tasks database.');
  }
}
