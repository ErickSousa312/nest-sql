import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/v1/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('atendimentoTipoOcorrencia')
  getAtendimentosTipos() {
    return this.appService.atendimentoPorTipoOcorrencia();
  }

  @Get('atendimentoVeiculo')
  getAtendimentosVeiculos() {
    return this.appService.atendimentoPorVeiculo();
  }

  @Get('atendimentosSexo')
  getAtendimentosSexo() {
    return this.appService.atendimentoPorSexo();
  }

  @Get('atendimentoFaixaEtaria')
  getAtendimentoFaixaEtaria() {
    return this.appService.atendimentoPorFaixaEtaria();
  }

  @Get('atendimentoMotivosOcorrencia')
  getAtendimentoPorMotivosOcorrencia(@Query() params: any) {
    console.log(params.nameTipo);
    return this.appService.AtendimentoPorMotivos(params.nameTipo);
  }

  @Get('atendimentoChamadasDiaNoite')
  getAtendimentoChamadasDiaNoite() {
    return this.appService.AtendimentoChamadasDiaNoite();
  }

  @Get('tempoResposta')
  getTempoResposta() {
    return this.appService.TempoResposta();
  }

  @Get('tempoDecorridoLocal')
  getTempoLocal() {
    return this.appService.TempoNoLocal();
  }

  @Get('tempoSaidaLocal')
  getTempoSaidaLocal() {
    return this.appService.TempoSaidaLocal();
  }

  @Get('destinoPaciente')
  getDestinoPaciente() {
    return this.appService.DestinoPaciente();
  }

  @Get('transferencias')
  getTransferencias() {
    return this.appService.Transferencias();
  }

  @Get('obito')
  getObito() {
    return this.appService.Obito();
  }
  @Get('atendimentosPorBairo')
  getAtendimentosPorBairo() {
    return this.appService.AtendimentosPorBairo();
  }
  @Get('cancelamentoAtendimento')
  getCancelamentoAtendimento() {
    return this.appService.CancelamentoAtendimento();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
