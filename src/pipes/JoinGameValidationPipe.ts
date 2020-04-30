import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { JoinGameDto } from '../dto/JoinGameDto';
import { validate } from 'class-validator';

@Injectable()
export class JoinGameValidationPipe implements PipeTransform {
    async transform(entity: any, _metadata: ArgumentMetadata): Promise<JoinGameDto> {
        let groups: string[];
        if (entity.start) {
            groups = ['start'];
        } else if (entity.join) {
            groups = ['join'];
        } else {
            throw new BadRequestException('Bad action type');
        }

        const entityAsDto = plainToClass(JoinGameDto, entity, { groups });

        entityAsDto.gameIdToJoin = entityAsDto.gameIdToJoin.toUpperCase();

        const errors = await validate(entityAsDto, { groups });
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
