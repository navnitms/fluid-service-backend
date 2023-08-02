import { DataSource } from 'typeorm';
import migrationConfig from './dataSource.config';

const dataSource = new DataSource(migrationConfig);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
dataSource.initialize();
export default dataSource;
