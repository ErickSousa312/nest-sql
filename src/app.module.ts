import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nest-knexjs';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'mssql',
        connection: {
          host: '192.168.100.133',
          port: 1433,
          user: 'sa',
          password: '@ntisaude',
          database: 'ESUSSAMU',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
