import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConversationRepositoryModule } from 'src/core/repository/conversation/conversation-repository.module';
import { CustomerAgentRepositoryModule } from 'src/core/repository/customer-agent/customer-agent.module';
import { CustomerRepositoryModule } from 'src/core/repository/customer/customer.module';
import { UserJobRepositoryModule } from 'src/core/repository/user-job/user-job.module';
import { UserRepositoryModule } from 'src/core/repository/user/user.module';
import { CustomerCrmService } from './customer-crm.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, CustomerCrmService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: configService.get('CRM_URL'),
        };
      },
      inject: [ConfigService],
    }),
    CustomerAgentRepositoryModule,
    UserRepositoryModule,
    CustomerRepositoryModule,
    ConversationRepositoryModule,
    UserJobRepositoryModule,
  ],
  exports: [CustomerService, CustomerCrmService],
})
export class CustomerModule {}
