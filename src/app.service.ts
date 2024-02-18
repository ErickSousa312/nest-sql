import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async atendimentoPorTipoOcorrencia(): Promise<any> {
    const data = await this.knex
      .select('Tipo.TipoDS')
      .count('*', { as: 'Total Ocorrencias' })
      .from('OcorrenciaMovimentacao')
      .innerJoin(
        'Ocorrencia',
        'OcorrenciaMovimentacao.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .innerJoin('Motivo', 'Ocorrencia.MotivoID', 'Motivo.MotivoID')
      .innerJoin('Tipo', 'Motivo.TipoID', 'Tipo.TipoID')
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .groupBy('Tipo.TipoDS')
      .orderBy('Tipo.TipoDS', 'desc');
    console.log(data);
    return data;
  }

  async atendimentoPorVeiculo(): Promise<any> {
    const data = await this.knex
      .select('Veiculos.VeiculoDS')
      .count('*', { as: 'Total Ocorrencias' })
      .from('OcorrenciaMovimentacao')
      .innerJoin(
        'Veiculos',
        'OcorrenciaMovimentacao.VeiculoID',
        'Veiculos.VeiculoID',
      )
      .innerJoin(
        'Ocorrencia',
        'OcorrenciaMovimentacao.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .groupBy('Veiculos.VeiculoDS')
      .orderBy('Total Ocorrencias', 'desc');

    return data;
  }

  async atendimentoPorSexo(): Promise<any> {
    const data = await this.knex
      .select('SexoDS')
      .count('*', { as: 'Total Ocorrencias' })
      .from('Vitimas')
      .leftJoin('TBS_Sexo', 'Vitimas.Sexo', 'TBS_Sexo.SexoCOD')
      .groupBy('SexoDS');
    return data;
  }

  async atendimentoPorFaixaEtaria(): Promise<any> {
    const data = await this.knex
      .select(
        this.knex.raw(`CASE
        WHEN idade < 1 THEN 'MENOR DE ANO'
        WHEN idade BETWEEN 1 AND 10 THEN '01 A 10 ANOS'
        WHEN idade BETWEEN 11 AND 20 THEN '11 A 20 ANOS'
        WHEN idade BETWEEN 21 AND 30 THEN '21 A 30 ANOS'
        WHEN idade BETWEEN 31 AND 40 THEN '31 A 40 ANOS'
        WHEN idade BETWEEN 41 AND 50 THEN '41 A 50 ANOS'
        WHEN idade BETWEEN 51 AND 60 THEN '51 A 60 ANOS'
        WHEN idade BETWEEN 61 AND 70 THEN '61 A 70 ANOS'
        WHEN idade BETWEEN 71 AND 80 THEN '71 A 80 ANOS'
        WHEN idade BETWEEN 81 AND 90 THEN '81 A 90 ANOS'
        WHEN idade BETWEEN 91 AND 100 THEN '91 A 100 ANOS'
        ELSE 'NÃO IDENTIFICADAS'
        END AS faixa_etaria`),
      )
      .count('*', { as: 'Total Ocorrencias' })
      .from('Vitimas')
      .groupBy(
        this.knex.raw(`CASE
        WHEN idade < 1 THEN 'MENOR DE ANO'
        WHEN idade BETWEEN 1 AND 10 THEN '01 A 10 ANOS'
        WHEN idade BETWEEN 11 AND 20 THEN '11 A 20 ANOS'
        WHEN idade BETWEEN 21 AND 30 THEN '21 A 30 ANOS'
        WHEN idade BETWEEN 31 AND 40 THEN '31 A 40 ANOS'
        WHEN idade BETWEEN 41 AND 50 THEN '41 A 50 ANOS'
        WHEN idade BETWEEN 51 AND 60 THEN '51 A 60 ANOS'
        WHEN idade BETWEEN 61 AND 70 THEN '61 A 70 ANOS'
        WHEN idade BETWEEN 71 AND 80 THEN '71 A 80 ANOS'
        WHEN idade BETWEEN 81 AND 90 THEN '81 A 90 ANOS'
        WHEN idade BETWEEN 91 AND 100 THEN '91 A 100 ANOS'
        ELSE 'NÃO IDENTIFICADAS'
        END`),
      )
      .orderBy('faixa_etaria');
    return data;
  }

  async AtendimentoPorMotivos(): Promise<any> {
    // const a = await new Promise((Resolve) =>
    //   setTimeout(() => Resolve({ erick: 'teste' }), 5000),
    // );
    const data = await this.knex
      .select('Tipo.TipoDS', 'Motivo.MotivoDS')
      .count('*', { as: 'Total Ocorrencias' })
      .from('OcorrenciaMovimentacao')
      .innerJoin(
        'Ocorrencia',
        'OcorrenciaMovimentacao.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .innerJoin('Motivo', 'Ocorrencia.MotivoID', ' Motivo.MotivoID')
      .innerJoin('Tipo', 'Motivo.TipoID', 'Tipo.TipoID')
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .groupBy('Tipo.TipoDS', 'Motivo.MotivoDS')
      .orderBy('Tipo.TipoDS', 'desc');

    return data;
  }

  async AtendimentoChamadasDiaNoite(): Promise<any> {
    const data = await this.knex
      .select(
        this.knex.raw(`CASE
      WHEN DATEPART(HOUR, DtHr) BETWEEN 7 AND 12 THEN '07:00 AS 12:00H'
      WHEN DATEPART(HOUR, DtHr) BETWEEN 13 AND 19 THEN '13:00 AS 19:00H'
      WHEN DATEPART(HOUR, DtHr) BETWEEN 20 AND 24 THEN '20:00 AS 24:00H'
      WHEN DATEPART(HOUR, DtHr) BETWEEN 1 AND 6 THEN '01:00 AS 06:00H'
      END AS PeriodoDia`),
      )
      .count('*', { as: 'Total Ocorrencias' })
      .from('OcorrenciaMovimentacao')
      .innerJoin(
        'Ocorrencia',
        'OcorrenciaMovimentacao.OCORRENCIAID',
        'Ocorrencia.OcorrenciaID',
      )
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .groupBy(
        this.knex.raw(`CASE
        WHEN DATEPART(HOUR, DtHr) BETWEEN 7 AND 12 THEN '07:00 AS 12:00H'
        WHEN DATEPART(HOUR, DtHr) BETWEEN 13 AND 19 THEN '13:00 AS 19:00H'
        WHEN DATEPART(HOUR, DtHr) BETWEEN 20 AND 24 THEN '20:00 AS 24:00H'
        WHEN DATEPART(HOUR, DtHr) BETWEEN 1 AND 6 THEN '01:00 AS 06:00H'
        END`),
      )
      .orderBy(`PeriodoDia`, 'desc');
    return data;
  }

  async TempoResposta(): Promise<any> {
    const data = this.knex
      .select('TempoResposta')
      .count('*', { as: 'Total Ocorrencias' })
      .from(
        this.knex.raw(` (
        SELECT
        CASE
        WHEN DATEDIFF(MINUTE, DtHr, ChegadaLocalDT) BETWEEN 0 AND 5 THEN '0 min a 5 min'
        WHEN DATEDIFF(MINUTE, DtHr, ChegadaLocalDT) BETWEEN 6 AND 10 THEN '6 min a 10 min'
        WHEN DATEDIFF(MINUTE, DtHr, ChegadaLocalDT) BETWEEN 11 AND 15 THEN '11 min a 15 min'
        WHEN DATEDIFF(MINUTE, DtHr, ChegadaLocalDT) BETWEEN 16 AND 20 THEN '16 min a 20 min'
        WHEN DATEDIFF(MINUTE, DtHr, ChegadaLocalDT) BETWEEN 21 AND 25 THEN '21 min a 25 min'
        WHEN DATEDIFF(MINUTE, DtHr, ChegadaLocalDT) BETWEEN 26 AND 30 THEN '26 min a 30 min'
        WHEN DATEDIFF(MINUTE, DtHr, ChegadaLocalDT) > 30 THEN 'Mais de 30 min'
        ELSE 'Não identificado'
        END AS TempoResposta
        FROM OcorrenciaMovimentacao
        INNER JOIN Ocorrencia ON OcorrenciaMovimentacao.OcorrenciaID = Ocorrencia.OcorrenciaID
        INNER JOIN Motivo ON Ocorrencia.MotivoID = Motivo.MotivoID
        WHERE OcorrenciaFinalDT <> '' AND SaidaLocalDT <> '' AND ChegadaDestinoDT <> ''
        ) AS Subquery`),
      )
      .groupBy('TempoResposta').orderByRaw(`CASE
      WHEN TempoResposta = '0 min a 5 min' THEN 1
      WHEN TempoResposta = '6 min a 10 min' THEN 2
      WHEN TempoResposta = '11 min a 15 min' THEN 3
      WHEN TempoResposta = '16 min a 20 min' THEN 4
      WHEN TempoResposta = '21 min a 25 min' THEN 5
      WHEN TempoResposta = '26 min a 30 min' THEN 6
      WHEN TempoResposta = 'Mais de 30 min' THEN 7
      ELSE 8
      END;`);
    return data;
  }

  async TempoNoLocal(): Promise<any> {
    const data = await this.knex
      .select('TempoNoLocal')
      .count('*', { as: 'Total Ocorrencias' })
      .from(
        this.knex.raw(`(
        SELECT
        CASE
        WHEN DATEDIFF(MINUTE, ChegadaLocalDT, SaidaLocalDT) BETWEEN 0 AND 5 THEN '0 min a 5 min'
        WHEN DATEDIFF(MINUTE, ChegadaLocalDT, SaidaLocalDT) BETWEEN 6 AND 10 THEN '6 min a 10 min'
        WHEN DATEDIFF(MINUTE, ChegadaLocalDT, SaidaLocalDT) BETWEEN 11 AND 15 THEN '11 min a 15 min'
        WHEN DATEDIFF(MINUTE, ChegadaLocalDT, SaidaLocalDT) BETWEEN 16 AND 20 THEN '16 min a 20 min'
        WHEN DATEDIFF(MINUTE, ChegadaLocalDT, SaidaLocalDT) BETWEEN 21 AND 25 THEN '21 min a 25 min'
        WHEN DATEDIFF(MINUTE, ChegadaLocalDT, SaidaLocalDT) BETWEEN 26 AND 30 THEN '26 min a 30 min'
        WHEN DATEDIFF(MINUTE, ChegadaLocalDT, SaidaLocalDT) > 30 THEN 'Mais de 30 min'
        ELSE 'Não identificado'
        END AS TempoNoLocal
        FROM OcorrenciaMovimentacao
        INNER JOIN Ocorrencia ON OcorrenciaMovimentacao.OcorrenciaID = Ocorrencia.OcorrenciaID
        INNER JOIN Motivo ON Ocorrencia.MotivoID = Motivo.MotivoID
        WHERE OcorrenciaFinalDT <> '' AND SaidaLocalDT <> '' AND ChegadaDestinoDT <> ''
        ) AS Subquery`),
      )
      .groupBy('TempoNoLocal').orderByRaw(`CASE
      WHEN TempoNoLocal = '0 min a 5 min' THEN 1
      WHEN TempoNoLocal = '6 min a 10 min' THEN 2
      WHEN TempoNoLocal = '11 min a 15 min' THEN 3
      WHEN TempoNoLocal = '16 min a 20 min' THEN 4
      WHEN TempoNoLocal = '21 min a 25 min' THEN 5
      WHEN TempoNoLocal = '26 min a 30 min' THEN 6
      WHEN TempoNoLocal = 'Mais de 30 min' THEN 7
      ELSE 8
      END`);
    return data;
  }

  async TempoSaidaLocal(): Promise<any> {
    const data = await this.knex
      .select('TempoSaidaLocal')
      .count('*', { as: 'Total Ocorrencias' })
      .from(
        this.knex.raw(`(
        SELECT
        CASE
        WHEN DATEDIFF(MINUTE, SaidaLocalDT, ChegadaDestinoDT) BETWEEN 0 AND 5 THEN '0 min a 5 min'
        WHEN DATEDIFF(MINUTE, SaidaLocalDT, ChegadaDestinoDT) BETWEEN 6 AND 10 THEN '6 min a 10 min'
        WHEN DATEDIFF(MINUTE, SaidaLocalDT, ChegadaDestinoDT) BETWEEN 11 AND 15 THEN '11 min a 15 min'
        WHEN DATEDIFF(MINUTE, SaidaLocalDT, ChegadaDestinoDT) BETWEEN 16 AND 20 THEN '16 min a 20 min'
        WHEN DATEDIFF(MINUTE, SaidaLocalDT, ChegadaDestinoDT) BETWEEN 21 AND 25 THEN '21 min a 25 min'
        WHEN DATEDIFF(MINUTE, SaidaLocalDT, ChegadaDestinoDT) BETWEEN 26 AND 30 THEN '26 min a 30 min'
        WHEN DATEDIFF(MINUTE, SaidaLocalDT, ChegadaDestinoDT) > 30 THEN 'Mais de 30 min'
        ELSE 'Não identificado'
        END AS TempoSaidaLocal
        FROM OcorrenciaMovimentacao
        INNER JOIN Ocorrencia ON OcorrenciaMovimentacao.OcorrenciaID = Ocorrencia.OcorrenciaID
        INNER JOIN Motivo ON Ocorrencia.MotivoID = Motivo.MotivoID
        WHERE OcorrenciaFinalDT <> '' AND SaidaLocalDT <> '' AND ChegadaDestinoDT <> ''
        ) AS Subquery`),
      )
      .groupBy('TempoSaidaLocal').orderByRaw(`CASE
      WHEN TempoSaidaLocal = '0 min a 5 min' THEN 1
      WHEN TempoSaidaLocal = '6 min a 10 min' THEN 2
      WHEN TempoSaidaLocal = '11 min a 15 min' THEN 3
      WHEN TempoSaidaLocal = '16 min a 20 min' THEN 4
      WHEN TempoSaidaLocal = '21 min a 25 min' THEN 5
      WHEN TempoSaidaLocal = '26 min a 30 min' THEN 6
      WHEN TempoSaidaLocal = 'Mais de 30 min' THEN 7
      ELSE 8
      END`);
    return data;
  }

  async DestinoPaciente(): Promise<any> {
    const data = await this.knex
      .select('UnidadesDestino.UnidadeDS')
      .count('*', { as: 'Total Atendimento' })
      .from('HISTORICO_DECISAO_GESTORA')
      .innerJoin(
        'UnidadesDestino',
        'HISTORICO_DECISAO_GESTORA.DESTINOID',
        'UnidadesDestino.UnidadeCOD',
      )
      .innerJoin(
        'UnidadesDestino',
        'HISTORICO_DECISAO_GESTORA.DESTINOID',
        'UnidadesDestino.UnidadeCOD',
      )
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .groupBy('UnidadesDestino.UnidadeDS')
      .orderBy('Total Atendimento', 'desc');
    return data;
  }

  async Transferencias(): Promise<any> {
    const data = await this.knex
      .select('Tipo.TipoDS')
      .count('*', { as: 'Total Atendimento' })
      .from('OcorrenciaMovimentacao')
      .innerJoin(
        'Ocorrencia',
        'OcorrenciaMovimentacao.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .innerJoin('Motivo', 'Ocorrencia.MotivoID', 'Motivo.MotivoID')
      .innerJoin('Tipo', 'Motivo.TipoID', 'Tipo.TipoID')
      .innerJoin('LigacaoTP', 'Ocorrencia.LigacaoTPID', 'LigacaoTP.LigacaoTPID')
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .andWhere('LigacaoTP.LigacaoTPDS', '=', 'TRANSFERÊNCIA')
      .groupBy('Tipo.TipoDS')
      .orderBy('TipoDS ', 'desc');
    return data;
  }

  async Obito(): Promise<any> {
    const data = this.knex.raw(`SELECT
    Obito,
    QuantidadeObito
    FROM
    (
    SELECT
    'POR ACIDENTE DE TRANSITO' AS Obito,
    COUNT(*) AS QuantidadeObito
    FROM
    HISTORICO_DECISAO_GESTORA
    INNER JOIN
    Ocorrencia ON HISTORICO_DECISAO_GESTORA.OCORRENCIAID = Ocorrencia.OcorrenciaID
    INNER JOIN
    Intercorrencias ON HISTORICO_DECISAO_GESTORA.INTERCORRENCIAID = Intercorrencias.IntercorrenciaID
    INNER JOIN
    Motivo ON Ocorrencia.MotivoID = Motivo.MotivoID
    INNER JOIN
    Tipo ON Motivo.TipoID = Tipo.TipoID
    WHERE
    Intercorrencias.IntercorrenciaID IN (18, 16, 19)
    AND Motivo.MotivoDS IN (
    'ACIDENTE ONIBUS (TRANSPORTE COLETIVO)',
    'ATROPELAMENTO POR BICICLETA',
    'ATROPELAMENTO POR CAMINHÃO',
    'ATROPELAMENTO POR CARRO',
    'ATROPELAMENTO POR MOTO',
    'ATROPELAMENTO POR ÔNIBUS',
    'ATROPELAMENTO POR TREM',
    'CAPOTAGEM DE VEÍCULO',
    'CAPOTAMENTOCOLISÃO',
    'COLISÃO ANIMAL X BICICLETA',
    'COLISÃO ANIMAL X CARRO',
    'COLISÃO ANIMAL X MOTO',
    'COLISÃO CARRO X BICICLETA',
    'COLISÃO CARRO X CAMINHÃO',
    'COLISÃO CARRO X CARRO',
    'COLISÃO CARRO X MOTO',
    'COLISÃO CARRO X MURO/POSTE',
    'COLISÃO CARRO X ÔNIBUS',
    'COLISÃO CARRO X TREM',
    'COLISÃO MOTO X CAMINHÃO',
    'COLISÃO MOTO X MOTO',
    'QUEDA DE MOTO'
    )
    ) AS Subconsulta1
    UNION ALL
    SELECT
    Obito,
    QuantidadeObito
    FROM
    (
    SELECT
    'POR CAUSA CLINICA ' AS Obito,
    COUNT(*) AS QuantidadeObito
    FROM
    HISTORICO_DECISAO_GESTORA
    INNER JOIN
    Ocorrencia ON HISTORICO_DECISAO_GESTORA.OCORRENCIAID = Ocorrencia.OcorrenciaID
    INNER JOIN
    Intercorrencias ON HISTORICO_DECISAO_GESTORA.INTERCORRENCIAID = Intercorrencias.IntercorrenciaID
    INNER JOIN
    Motivo ON Ocorrencia.MotivoID = Motivo.MotivoID
    INNER JOIN
    Tipo ON Motivo.TipoID = Tipo.TipoID
    WHERE
    Intercorrencias.IntercorrenciaID IN (18, 16, 19)
    AND Tipo.TipoID IN (
    17
    )
    ) AS Subconsulta2
    UNION ALL
    SELECT
    Obito,
    QuantidadeObito
    FROM
    (
    SELECT
    'POR OUTRAS CAUSAS EXTERNAS' AS Obito,
    COUNT(*) AS QuantidadeObito
    FROM
    HISTORICO_DECISAO_GESTORA
    INNER JOIN
    Ocorrencia ON HISTORICO_DECISAO_GESTORA.OCORRENCIAID = Ocorrencia.OcorrenciaID
    INNER JOIN
    Intercorrencias ON HISTORICO_DECISAO_GESTORA.INTERCORRENCIAID = Intercorrencias.IntercorrenciaID
    INNER JOIN
    Motivo ON Ocorrencia.MotivoID = Motivo.MotivoID
    INNER JOIN
    Tipo ON Motivo.TipoID = Tipo.TipoID
    WHERE
    Intercorrencias.IntercorrenciaID IN (18, 16, 19)
    AND Tipo.TipoDS not IN (
    'CLINICO'
    ) AND Motivo.MotivoDS not in(
    'ACIDENTE ONIBUS (TRANSPORTE COLETIVO)',
    'ATROPELAMENTO POR BICICLETA',
    'ATROPELAMENTO POR CAMINHÃO',
    'ATROPELAMENTO POR CARRO',
    'ATROPELAMENTO POR MOTO',
    'ATROPELAMENTO POR ÔNIBUS',
    'ATROPELAMENTO POR TREM',
    'CAPOTAGEM DE VEÍCULO',
    'CAPOTAMENTOCOLISÃO',
    'COLISÃO ANIMAL X BICICLETA',
    'COLISÃO ANIMAL X CARRO',
    'COLISÃO ANIMAL X MOTO',
    'COLISÃO CARRO X BICICLETA',
    'COLISÃO CARRO X CAMINHÃO',
    'COLISÃO CARRO X CARRO',
    'COLISÃO CARRO X MOTO',
    'COLISÃO CARRO X MURO/POSTE',
    'COLISÃO CARRO X ÔNIBUS',
    'COLISÃO CARRO X TREM',
    'COLISÃO MOTO X CAMINHÃO',
    'COLISÃO MOTO X MOTO',
    'QUEDA DE MOTO'
    )
    ) AS Subconsulta3`);
    return data;
  }

  async AtendimentosPorBairo(): Promise<any> {
    const data = this.knex
      .select('Ocorrencia.Bairro')
      .count('*', { as: 'Total Ocorrencias' })
      .from('OcorrenciaMovimentacao')
      .innerJoin(
        'Ocorrencia',
        'OcorrenciaMovimentacao.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .groupBy('Ocorrencia.Bairro')
      .orderBy('Total Ocorrencias', 'desc');
    return data;
  }

  async CancelamentoAtendimento(): Promise<any> {
    const data = await this.knex
      .select('CancelamentoTP.CancelDS')
      .count('*', { as: 'Total Ocorrencias' })
      .from('FORMEQUIPE_SolicitacaoVeiculo')
      .innerJoin(
        'Ocorrencia',
        'FORMEQUIPE_SolicitacaoVeiculo.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .innerJoin(
        'CancelamentoTP',
        'FORMEQUIPE_SolicitacaoVeiculo.CancelTP',
        'CancelamentoTP.CancelTP',
      )
      .groupBy('CancelamentoTP.CancelDS')
      .orderBy('Total Ocorrencias', 'desc');
    return data;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
