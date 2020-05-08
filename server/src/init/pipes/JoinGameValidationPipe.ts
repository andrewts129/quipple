import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { JoinGameDto } from '../dto/incoming/JoinGameDto';
import { validate } from 'class-validator';

@Injectable()
export class JoinGameValidationPipe implements PipeTransform {
    async transform(entity: any, _metadata: ArgumentMetadata): Promise<JoinGameDto> {
        const entityAsDto = plainToClass(JoinGameDto, entity);

        entityAsDto.gameIdToJoin = entityAsDto.gameIdToJoin.toUpperCase();

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
