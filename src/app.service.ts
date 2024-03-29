import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { whereClauses } from './functions/whereClauses';
@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async atendimentoPorTipoOcorrencia(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    const data = await this.knex
      .select('Tipo.TipoDS')
      .count('*', { as: 'Total_Ocorrencias' })
      .from('OcorrenciaMovimentacao')
      .innerJoin(
        'Ocorrencia',
        'OcorrenciaMovimentacao.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .innerJoin('Motivo', 'Ocorrencia.MotivoID', 'Motivo.MotivoID')
      .innerJoin('Tipo', 'Motivo.TipoID', 'Tipo.TipoID')
      .modify((queryBuilder) => {
        if (whereClauses.length > 0) {
          queryBuilder.whereRaw(whereS.join(' AND '), bind);
        }
      })
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .groupBy('Tipo.TipoDS');
    const dadosFormatados = data.map((item) => ({
      TipoDS: item.TipoDS
        ? item.TipoDS.charAt(0).toUpperCase() +
          item.TipoDS.slice(1).toLowerCase()
        : null,
      Total_Ocorrencias: item.Total_Ocorrencias,
    }));
    return dadosFormatados;
  }

  async atendimentoPorVeiculo(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    const data = await this.knex
      .select('Veiculos.VeiculoDS')
      .count('*', { as: 'Total_Ocorrencias' })
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
      .modify((queryBuilder) => {
        if (whereClauses.length > 0) {
          queryBuilder.whereRaw(whereS.join(' AND '), bind);
        }
      })
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .groupBy('Veiculos.VeiculoDS')
      .orderBy('Total_Ocorrencias', 'desc');
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
    return data;
  }

  async atendimentoPorSexo(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);

    const data = await this.knex
      .select('TBS_Sexo.SexoDS')
      .count('*', { as: 'Total_Ocorrencias' })
      .from('Vitimas')
      .leftJoin('TBS_Sexo', 'Vitimas.Sexo', 'TBS_Sexo.SexoCOD')
      .innerJoin(
        'Ocorrencia',
        'Vitimas.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .innerJoin(
        'OcorrenciaMovimentacao',
        'OcorrenciaMovimentacao.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .modify((queryBuilder) => {
        if (whereClauses.length > 0) {
          queryBuilder.whereRaw(whereS.join(' AND '), bind);
        }
      })
      .groupBy('TBS_Sexo.SexoDS');

    const dadosFormatados = data.map((item) => ({
      SexoDS: item.SexoDS
        ? item.SexoDS.charAt(0).toUpperCase() +
          item.SexoDS.slice(1).toLowerCase()
        : null,
      Total_Ocorrencias: item.Total_Ocorrencias,
    }));
    console.log(dadosFormatados);
    return dadosFormatados;
  }

  async atendimentoPorFaixaEtaria(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
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
      .count('*', { as: 'Total_Ocorrencias' })
      .from('Vitimas')
      .innerJoin(
        'Ocorrencia',
        'Vitimas.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .innerJoin(
        'OcorrenciaMovimentacao',
        'OcorrenciaMovimentacao.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .modify((queryBuilder) => {
        if (whereClauses.length > 0) {
          queryBuilder.whereRaw(whereS.join(' AND '), bind);
        }
      })
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

  async AtendimentoPorMotivos(
    TipoDS: string | undefined,
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    let data;
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    if (!TipoDS || TipoDS == 'undefined') {
      console.log('entrou');
      data = await this.knex
        .select('Tipo.TipoDS', 'Motivo.MotivoDS')
        .count('*', { as: 'Total_Ocorrencias' })
        .from('OcorrenciaMovimentacao')
        .innerJoin(
          'Ocorrencia',
          'OcorrenciaMovimentacao.OcorrenciaID',
          'Ocorrencia.OcorrenciaID',
        )
        .innerJoin('Motivo', 'Ocorrencia.MotivoID', ' Motivo.MotivoID')
        .innerJoin('Tipo', 'Motivo.TipoID', 'Tipo.TipoID')
        .modify((queryBuilder) => {
          if (whereClauses.length > 0) {
            queryBuilder.whereRaw(whereS.join(' AND '), bind);
          }
        })
        .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
        .groupBy('Tipo.TipoDS', 'Motivo.MotivoDS')
        .orderBy('Total_Ocorrencias', 'desc');
      return data;
    }
    data = await this.knex
      .select('Tipo.TipoDS', 'Motivo.MotivoDS')
      .count('*', { as: 'Total_Ocorrencias' })
      .from('OcorrenciaMovimentacao')
      .innerJoin(
        'Ocorrencia',
        'OcorrenciaMovimentacao.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .innerJoin('Motivo', 'Ocorrencia.MotivoID', ' Motivo.MotivoID')
      .innerJoin('Tipo', 'Motivo.TipoID', 'Tipo.TipoID')
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .modify((queryBuilder) => {
        if (whereClauses.length > 0) {
          queryBuilder.whereRaw(whereS.join(' AND '), bind);
        }
      })
      .andWhere('Tipo.TipoDS', '=', TipoDS)
      .groupBy('Tipo.TipoDS', 'Motivo.MotivoDS')
      .orderBy('Tipo.TipoDS', 'desc');

    return data;
  }

  async AtendimentoChamadasDiaNoite(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    const data = await this.knex
      .select(
        this.knex.raw(`CASE
      WHEN DATEPART(HOUR, DtHr) BETWEEN 7 AND 12 THEN '07:00 AS 12:00H'
      WHEN DATEPART(HOUR, DtHr) BETWEEN 13 AND 19 THEN '13:00 AS 19:00H'
      WHEN DATEPART(HOUR, DtHr) BETWEEN 20 AND 24 THEN '20:00 AS 24:00H'
      WHEN DATEPART(HOUR, DtHr) BETWEEN 1 AND 6 THEN '01:00 AS 06:00H'
      END AS PeriodoDia`),
      )
      .count('*', { as: 'Total_Ocorrencias' })
      .from('OcorrenciaMovimentacao')
      .innerJoin(
        'Ocorrencia',
        'OcorrenciaMovimentacao.OCORRENCIAID',
        'Ocorrencia.OcorrenciaID',
      )
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .modify((queryBuilder) => {
        if (whereClauses.length > 0) {
          queryBuilder.whereRaw(whereS.join(' AND '), bind);
        }
      })
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

  async TempoResposta(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);

    const data = this.knex
      .select('TempoResposta')
      .count('*', { as: 'Total_Ocorrencias' })
      .from(
        this.knex.raw(
          `(
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
    ${whereS.length > 0 ? 'AND ' + whereS.join(' AND ') : ''}
  ) AS Subquery`,
          bind,
        ),
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
END`);
    return data;
  }

  async TempoNoLocal(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    const data = await this.knex
      .select('TempoNoLocal')
      .count('*', { as: 'Total_Ocorrencias' })
      .from(
        this.knex.raw(
          `(
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
        ${whereS.length > 0 ? 'AND ' + whereS.join(' AND ') : ''}
        ) AS Subquery`,
          bind,
        ),
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

  async TempoSaidaLocal(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    const data = await this.knex
      .select('TempoSaidaLocal')
      .count('*', { as: 'Total_Ocorrencias' })
      .from(
        this.knex.raw(
          `(
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
        ${whereS.length > 0 ? 'AND ' + whereS.join(' AND ') : ''}
        ) AS Subquery`,
          bind,
        ),
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

  async DestinoPaciente(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    const data = await this.knex
      .select('UnidadesDestino.UnidadeDS')
      .count('*', { as: 'Total_Ocorrencias' })
      .from('HISTORICO_DECISAO_GESTORA')
      .innerJoin(
        'Ocorrencia',
        'HISTORICO_DECISAO_GESTORA.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .innerJoin(
        'UnidadesDestino',
        'HISTORICO_DECISAO_GESTORA.DESTINOID',
        'UnidadesDestino.UnidadeCOD',
      )
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .modify((queryBuilder) => {
        if (whereClauses.length > 0) {
          queryBuilder.whereRaw(whereS.join(' AND '), bind);
        }
      })
      .groupBy('UnidadesDestino.UnidadeDS')
      .orderBy('Total_Ocorrencias', 'desc');
    return data;
  }

  async Transferencias(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    const data = await this.knex
      .select('Tipo.TipoDS')
      .count('*', { as: 'Total_Ocorrencias' })
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
      .modify((queryBuilder) => {
        if (whereClauses.length > 0) {
          queryBuilder.whereRaw(whereS.join(' AND '), bind);
        }
      })
      .andWhere('LigacaoTP.LigacaoTPDS', '=', 'TRANSFERÊNCIA')
      .groupBy('Tipo.TipoDS')
      .orderBy('TipoDS ', 'desc');
    return data;
  }

  async Obito(mes: string | undefined, ano: string | undefined): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    let bindTriplicado = [];
    for (let i = 0; i < 3; i++) {
      bindTriplicado = bindTriplicado.concat(bind);
    }
    const data = this.knex.raw(
      `SELECT
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
    )${whereS.length > 0 ? 'AND ' + whereS.join(' AND ') : ''}
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
    )${whereS.length > 0 ? 'AND ' + whereS.join(' AND ') : ''}
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
    )${whereS.length > 0 ? 'AND ' + whereS.join(' AND ') : ''}
    ) AS Subconsulta3`,
      bindTriplicado,
    );
    return data;
  }

  async AtendimentosPorBairo(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    const data = this.knex
      .select('Ocorrencia.Bairro')
      .count('*', { as: 'Total_Ocorrencias' })
      .from('OcorrenciaMovimentacao')
      .innerJoin(
        'Ocorrencia',
        'OcorrenciaMovimentacao.OcorrenciaID',
        'Ocorrencia.OcorrenciaID',
      )
      .where('Ocorrencia.OcorrenciaFinalDT', '<>', '')
      .modify((queryBuilder) => {
        if (whereClauses.length > 0) {
          queryBuilder.whereRaw(whereS.join(' AND '), bind);
        }
      })
      .groupBy('Ocorrencia.Bairro')
      .orderBy('Total_Ocorrencias', 'desc');
    return data;
  }

  async CancelamentoAtendimento(
    mes: string | undefined,
    ano: string | undefined,
  ): Promise<any> {
    const { whereClauses: whereS, bindings: bind } = whereClauses(ano, mes);
    const data = await this.knex
      .select('CancelamentoTP.CancelDS')
      .count('*', { as: 'Total_Ocorrencias' })
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
      .modify((queryBuilder) => {
        if (whereClauses.length > 0) {
          queryBuilder.whereRaw(whereS.join(' AND '), bind);
        }
      })
      .groupBy('CancelamentoTP.CancelDS')
      .orderBy('Total_Ocorrencias', 'desc');
    return data;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
