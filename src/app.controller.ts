import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/v1/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('atendimentoTipoOcorrencia')
  getAtendimentosTipos(@Query() params: any) {
    return this.appService.atendimentoPorTipoOcorrencia(params.mes, params.ano);
  }

  @Get('atendimentoVeiculo')
  getAtendimentosVeiculos(@Query() params: any) {
    return this.appService.atendimentoPorVeiculo(params.mes, params.ano);
  }

  @Get('atendimentosSexo')
  getAtendimentosSexo(@Query() params: any) {
    // console.log(params.mes);
    console.log(params);
    return this.appService.atendimentoPorSexo(params.mes, params.ano);
  }

  @Get('atendimentoFaixaEtaria')
  getAtendimentoFaixaEtaria(@Query() params: any) {
    console.log(params.ano);
    return this.appService.atendimentoPorFaixaEtaria(params.mes, params.ano);
  }

  @Get('atendimentoMotivosOcorrencia')
  getAtendimentoPorMotivosOcorrencia(@Query() params: any) {
    console.log(params.nameTipo);
    return this.appService.AtendimentoPorMotivos(
      params.nameTipo,
      params.mes,
      params.ano,
    );
  }

  @Get('atendimentoChamadasDiaNoite')
  getAtendimentoChamadasDiaNoite(@Query() params: any) {
    return this.appService.AtendimentoChamadasDiaNoite(params.mes, params.ano);
  }

  @Get('tempoResposta')
  getTempoResposta(@Query() params: any) {
    return this.appService.TempoResposta(params.mes, params.ano);
  }

  @Get('tempoDecorridoLocal')
  getTempoLocal(@Query() params: any) {
    return this.appService.TempoNoLocal(params.mes, params.ano);
  }

  @Get('tempoSaidaLocal')
  getTempoSaidaLocal(@Query() params: any) {
    return this.appService.TempoSaidaLocal(params.mes, params.ano);
  }

  @Get('destinoPaciente')
  getDestinoPaciente(@Query() params: any) {
    return this.appService.DestinoPaciente(params.mes, params.ano);
  }

  @Get('transferencias')
  getTransferencias(@Query() params: any) {
    return this.appService.Transferencias(params.mes, params.ano);
  }

  @Get('obitos')
  getObito(@Query() params: any) {
    return this.appService.Obito(params.mes, params.ano);
  }
  @Get('atendimentosPorBairo')
  getAtendimentosPorBairo(@Query() params: any) {
    return this.appService.AtendimentosPorBairo(params.mes, params.ano);
  }
  @Get('cancelamentoAtendimento')
  getCancelamentoAtendimento(@Query() params: any) {
    return this.appService.CancelamentoAtendimento(params.mes, params.ano);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
