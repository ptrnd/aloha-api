import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MessageTemplateEntity } from 'src/core/repository/message-template/message-template.entity';
import { MESSAGE_TEMPLATE_REPOSITORY } from 'src/core/repository/message-template/message-template.module';
import { ApiResponse } from 'src/utils/apiresponse.dto';
import { Repository } from 'typeorm';
import { MessageTemplateRequestDto } from '../message.dto';

Injectable();
export class MessageTemplateService {
  constructor(
    @Inject(MESSAGE_TEMPLATE_REPOSITORY)
    private messageTemplateRepository: Repository<MessageTemplateEntity>,
  ) {}

  async getMessageTemplates() {
    const data = await this.messageTemplateRepository.find();
    return <ApiResponse<MessageTemplateEntity[]>>{
      success: true,
      data: data,
      message: 'success getting message templates',
    };
  }

  async addMessageTemplate(body: MessageTemplateRequestDto) {
    let addData = await this.messageTemplateRepository.create({
      name: body.name,
      template: body.template,
    });
    addData = await this.messageTemplateRepository.save(addData);
    return <ApiResponse<MessageTemplateEntity>>{
      success: true,
      data: addData,
      message: 'Success adding template',
    };
  }

  async updateMessageTemplate(id: number, body: MessageTemplateRequestDto) {
    const templates = await this.messageTemplateRepository.findOne({
      where: {
        id: id,
      },
    });

    if (templates === null) {
      throw new NotFoundException('template not found');
    }

    templates.name = body.name;
    templates.template = body.template;

    const newTemplate = await this.messageTemplateRepository.save(templates);

    return <ApiResponse<MessageTemplateEntity>>{
      success: true,
      data: newTemplate,
      message: 'Success adding template',
    };
  }

  async deleteTemplate(id: number) {
    const templates = await this.messageTemplateRepository.findOne({
      where: {
        id: id,
      },
    });

    if (templates === null) {
      throw new NotFoundException('template not found');
    }

    await this.messageTemplateRepository.delete(id);

    return <ApiResponse<MessageTemplateEntity>>{
      success: true,
      data: templates,
      message: 'Success delete template',
    };
  }
}
