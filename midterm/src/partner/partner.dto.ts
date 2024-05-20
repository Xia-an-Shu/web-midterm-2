import {IsNotEmpty, IsString, IsDate, IsEmail} from 'class-validator';

export class PartnerDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsDate()
    readonly birthdate: Date;

}
