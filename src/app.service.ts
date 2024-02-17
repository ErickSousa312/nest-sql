import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async Query(): Promise<any> {
    const data = await this.knex.raw(
      `select 
         Veiculos.VeiculoDS, COUNT(*) AS total_atendimentos
       from OcorrenciaMovimentacao
       INNER JOIN Veiculos ON OcorrenciaMovimentacao.VeiculoID = Veiculos.VeiculoID
       INNER JOIN Ocorrencia ON OcorrenciaMovimentacao.OcorrenciaID = Ocorrencia.OcorrenciaID
       GROUP BY Veiculos.VeiculoDS ORDER BY total_atendimentos DESC`,
    );
    data.forEach((item: any) => {
      item.VeiculoDS = item.VeiculoDS.replace(/\s/g, '');
      item.VeiculoDS = item.VeiculoDS.replace(/01(?!\d)/g, '1');
      item.VeiculoDS = item.VeiculoDS.replace(/02(?!\d)/g, '2');
      item.VeiculoDS = item.VeiculoDS.replace(/03(?!\d)/g, '3');
      item.VeiculoDS = item.VeiculoDS.replace(/04(?!\d)/g, '4');
      const hyphenIndex = item.VeiculoDS.indexOf('-');
      if (hyphenIndex !== -1) {
        const secondHyphenIndex = item.VeiculoDS.indexOf('-', hyphenIndex + 1);
        if (secondHyphenIndex !== -1) {
          const firstPart = item.VeiculoDS.slice(0, secondHyphenIndex).trim();
          item.VeiculoDS = firstPart;
        }
      }
      item.VeiculoDS = item.VeiculoDS.replace('MARABA', 'MAB');
      item.VeiculoDS = item.VeiculoDS.replace('PARAUAPEBAS', 'PEB');
      item.VeiculoDS = item.VeiculoDS.replace('BOMJESUS', 'BJES');
      item.VeiculoDS = item.VeiculoDS.replace('RONDON', 'RDON');
      item.VeiculoDS = item.VeiculoDS.replace(/-{2,}/g, '-');
      item.VeiculoDS = item.VeiculoDS.replace(/\d{4}$/, '');
    });
    console.log(data);
    return data;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
