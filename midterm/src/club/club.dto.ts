import {IsNotEmpty, IsString, IsUrl, IsDate} from 'class-validator';

export class ClubDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsDate()
    readonly foundationDate: Date;

    @IsNotEmpty()
    @IsUrl()
    readonly image: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

}
