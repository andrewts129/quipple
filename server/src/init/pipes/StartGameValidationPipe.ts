import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { StartGameDto } from '../dto/incoming/StartGameDto';

@Injectable()
export class StartGameValidationPipe implements PipeTransform {
    async transform(entity: any, _metadata: ArgumentMetadata): Promise<StartGameDto> {
        const entityAsDto = plainToClass(StartGameDto, entity);
        const errors = await validate(entityAsDto);
        if (errors.length > 0) {
            throw new HttpException(
                {
                    message: 'Input validation failed',
                    errors
                },
                HttpStatus.BAD_REQUEST
            );
        } else {
            return entityAsDto;
        }
    }
}
