// src/modules/patients/infrastructure/ai/ai-service.provider.ts
import { Provider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SimulatedDiagnosisService } from './simulated-diagnosis.service';
import { OpenAiDiagnosisService } from './openai-diagnosis.service';
import { AI_DIAGNOSIS_SERVICE } from '../../domain/interfaces/ai-diagnosis.service.interface';

export const AiServiceProvider: Provider = {
  provide: AI_DIAGNOSIS_SERVICE,
  useFactory: (configService: ConfigService) => {
    const provider = configService.get<string>(
      'AI_SERVICE_PROVIDER',
      'simulated',
    );
    const logger = new Logger('AiServiceProvider');

    if (provider === 'openai') {
      logger.log('Using OpenAI Diagnosis Service');
      return new OpenAiDiagnosisService(configService);
    } else {
      logger.log('Using Simulated Diagnosis Service');
      return new SimulatedDiagnosisService();
    }
  },
  inject: [ConfigService],
};
