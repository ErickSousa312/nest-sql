import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async Query(): Promise<any> {
    const data = await this.knex.raw(
      ' select top 4 Veiculos.VeiculoDS, COUNT(*) AS total_atendimentos from OcorrenciaMovimentacao INNER JOIN Veiculos ON OcorrenciaMovimentacao.VeiculoID = Veiculos.VeiculoID INNER JOIN Ocorrencia ON OcorrenciaMovimentacao.OcorrenciaID = Ocorrencia.OcorrenciaID GROUP BY Veiculos.VeiculoDS ORDER BY total_atendimentos DESC',
    );
    console.log(data);
    return data;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
