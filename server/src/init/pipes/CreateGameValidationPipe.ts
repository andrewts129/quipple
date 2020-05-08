import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateGameDto } from '../dto/incoming/CreateGameDto';

@Injectable()
export class CreateGameValidationPipe implements PipeTransform {
    async transform(entity: any, _metadata: ArgumentMetadata): Promise<CreateGameDto> {
        const entityAsDto = plainToClass(CreateGameDto, entity);
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
