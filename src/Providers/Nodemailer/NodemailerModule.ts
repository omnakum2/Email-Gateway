import { Module, Global } from '@nestjs/common';
import { NodemailerProvider } from './NodemailerProvider';

// Global module so NodemailerProvider is available everywhere.
@Global()
@Module({
  providers: [NodemailerProvider],
  exports: [NodemailerProvider],
})
export class NodemailerModule {}
