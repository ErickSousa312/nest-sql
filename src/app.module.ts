import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nest-knexjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        config: {
          client: configService.get<string>('DB_CLIENT'),
          connection: {
            host: configService.get<string>('HOST'),
            port: Number(configService.get('PORT')),
            user: configService.get<string>('USER'),
            password: configService.get<string>('PASSWORD'),
            database: configService.get<string>('DATABASE'),
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
